import parseCsv from "./csvParser";

const DATA_URL =
  "https://opendata.arcgis.com/api/v3/datasets/917fc37a709542548cc3be077a786c17_0/downloads/data?format=csv&spatialRefId=4326";


export type Per100kable = {
  residents: number;
  cases: number;
  cases7: number;
  deaths: number;
  deaths7: number;
};

export type RawDataEntry = {
  county: string;
  countyType: string;
  federal: string;
  federalResidents: number;
  federalCases7: number;
  federalDeaths7: number;
  deathRate: number;
  updated: Date;
} & Per100kable;

let loadedDataPromise: Promise<RawDataEntry[]>;

const parseRKIDateString = (dateString: string): Date => {
  const dateParser =
    /(?<day>\d+)\.(?<month>\d+)\.(?<year>\d+), (?<daytime>\d+:\d+)/u;
  const match = dateParser.exec(dateString);
  return new Date(`${match?.groups?.year}-${match?.groups?.month}-${match?.groups?.day}T${match?.groups?.daytime}Z`);
};

const loadCovidData = (): Promise<RawDataEntry[]> => {
  if (loadedDataPromise) {
    return loadedDataPromise;
  }

  const loadData = async () => {
    const resp = await fetch(DATA_URL);
    const csvData = parseCsv(await resp.text());

    // Make the raw data more useable
    return csvData.map(entry => ({
      cases: parseInt(entry.cases as string, 10) || 0,
      cases7: parseInt(entry.cases7_lk as string, 10) || 0,
      county: `${entry.county?.split(" ").slice(1)
        .join(" ")} ${entry.county?.split(" ")[0]}`,
      countyType: entry.BEZ,
      deathRate: parseFloat(entry.death_rate as string) || 0,
      deaths: parseInt(entry.deaths as string, 10) || 0,
      deaths7: parseInt(entry.death7_lk as string, 10) || 0,
      federal: entry.BL,
      federalCases7: parseInt(entry.cases7_bl as string, 10) || 0,
      federalDeaths7: parseInt(entry.death7_bl as string, 10) || 0,
      federalResidents: parseInt(entry.EWZ_BL as string, 10),
      residents: parseInt(entry.EWZ as string, 10),
      updated: parseRKIDateString(entry.last_update as string),
    })) as RawDataEntry[];
  };

  loadedDataPromise = loadData();

  return loadedDataPromise;
};

export const loadCovidDataByCounty = async (): Promise<
  Map<RawDataEntry["county"], RawDataEntry>
> => {
  const rawData = await loadCovidData();
  const result = new Map();
  for (const entry of rawData) {
    result.set(entry.county, entry);
  }
  return result;
};

export const loadCovidDataByFederal = async (): Promise<
  Map<
    RawDataEntry["federal"],
    {
      updated: Date;
      cases: number;
      cases7: number;
      deaths: number;
      deaths7: number;
      residents: number;
      counties: Map<RawDataEntry["county"], RawDataEntry>;
    }
  >
> => {
  const result = new Map();
  for (const entry of await loadCovidData()) {
    if (!result.has(entry.federal)) {
      result.set(entry.federal, {
        cases: 0,
        cases7: entry.federalCases7,
        counties: new Map(),
        deaths: 0,
        deaths7: entry.federalDeaths7,
        residents: entry.federalResidents,
        updated: entry.updated,
      });
    }

    const federal = result.get(entry.federal);
    if (federal.updated < entry.updated) federal.updated = entry.updated;
    federal.cases += entry.cases;
    federal.deaths += entry.deaths;
    federal.counties.set(entry.county, entry);
  }
  return result;
};

export const loadNationOverview = async (): Promise<{
  cases: number;
  cases7: number;
  deaths: number;
  deaths7: number;
  residents: number;
  updated: Date;
}> => {
  const counties = await loadCovidData();

  const result = {
    cases: 0,
    cases7: 0,
    deaths: 0,
    deaths7: 0,
    residents: 0,
    updated: counties[0].updated,
  };

  for (const county of counties) {
    result.cases += county.cases;
    result.cases7 += county.cases7;
    result.deaths += county.deaths;
    result.deaths7 += county.deaths7;
    result.residents += county.residents;
    if (result.updated < county.updated) result.updated = county.updated;
  }

  return result;
};

export default loadCovidData;
