export type CSVObject = {
  [key: string]: string;
};

const csvLineToArray = (line: string): string[] => {
  const tester = /(?<=^|,)(?<column>"[^"]*"|[^,]*)(?=,|$)/gu;
  const elements = line.match(tester);

  return (
    elements?.map(entry => entry.startsWith('"') && entry.endsWith('"') ? entry.slice(1, -1) : entry) ?? []
  );
};

const parseCsv = (text: string): CSVObject[] => {
  const [headerLine, ...dataLines] = text.trim().split("\n");
  const headers = csvLineToArray(headerLine);
  return dataLines.map(line => csvLineToArray(line).reduce((res: CSVObject, entry, i) => {
    res[headers[i]] = entry;
    return res;
  }, {}));
};

export default parseCsv;
