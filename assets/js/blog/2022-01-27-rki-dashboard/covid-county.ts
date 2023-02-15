import "./covid-overview";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  loadCovidDataByCounty,
  loadCovidDataByFederal,
} from "./covidDataLoader";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("covid-county")
export default class CovidCounty extends LitElement {
  static override styles = css`
    #wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      grid-template-areas: "federalSelect federalSelect ." "overview overview overview";
      gap: 0.5rem;
    }

    select {
      grid-area: federalSelect;
      padding: 0.5rem;
      background: #eee;
      border: none;
      border-radius: 0.3rem;
      min-width: 0;
    }

    covid-overview {
      grid-area: overview;
    }
  `;

  constructor() {
    super();
    loadCovidDataByFederal().then(data => {
      this.covidDataByFederal = data;
    });
    loadCovidDataByCounty().then(data => {
      this.covidDataByCounty = data;
    });
  }

  @state()
    covidDataByFederal?: Awaited<ReturnType<typeof loadCovidDataByFederal>>;

  @state()
    covidDataByCounty?: Awaited<ReturnType<typeof loadCovidDataByCounty>>;

  @property({ type: String })
    federal?: string;

  @state()
    county?: string;

  get federalData() {
    return this.covidDataByFederal?.get(this.federal as string);
  }

  get countyData() {
    return this.covidDataByCounty?.get(this.county as string);
  }

  get availableFederalCountiesSorted() {
    return [...this.federalData?.counties.keys() || []].sort();
  }

  get availableCounties() {
    return [...this.covidDataByCounty?.keys() || []].sort();
  }

  override updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("federal")) {
      [this.county] = this.availableFederalCountiesSorted;
    }
  }

  override render() {
    return html`
      <div id="wrapper">
        <select @input=${(e: any) => {
      this.county = e.target.value;
    }}>
          ${repeat(
      this.availableFederalCountiesSorted || this.availableCounties,
      (county: string) => county,
      (county: string) => html`<option>${county}</option>`,
    )}
        </select>
        <covid-overview
          residents=${ifDefined(this.countyData?.residents)}
          cases=${ifDefined(this.countyData?.cases)}
          deaths=${ifDefined(this.countyData?.deaths)}
          cases7=${ifDefined(this.countyData?.cases7)}
          deaths7=${ifDefined(this.countyData?.deaths7)}
        ></covid-overview>
      </div>
    `;
  }
}
console.log(CovidCounty);

// declare global {
//   interface HTMLElementTagNameMap {
//     "covid-county": CovidCounty;
//   }
// }
