import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

import {
  loadCovidDataByFederal,
  loadCovidDataByCounty,
} from "./covidDataLoader";

import "./covid-overview";

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

  #federal = "";

  @property()
  get federal(): string {
    return this.#federal;
  }

  set federal(val: string) {
    let oldVal = this.#federal;
    this.#federal = val;
    this.requestUpdate("prop", oldVal);
  }

  @state()
  covidDataByFederal = loadCovidDataByFederal();

  @state()
  covidDataByCounty = loadCovidDataByCounty().then((data) => {
    if (!this.county) this.updateCounty([...data.keys()].sort()[0]);
    return data;
  });

  @state()
  county?: string;

  updateCounty(county: string) {
    this.county = county;
    this.requestUpdate();
  }

  override render() {
    console.log(this.federal);
    return html`
      <div id="wrapper">
        <select @input=${(e: any) => this.updateCounty(e.target.value)}>
          ${until(
            this.federal
              ? this.covidDataByFederal.then((data) => {
                  const counties = data
                    .get(this.federal as string)
                    ?.counties?.keys();
                  if (!counties) return;
                  return [...counties]
                    .sort()
                    .map((federal) => html`<option>${federal}</option>`);
                })
              : this.covidDataByCounty.then((data) =>
                  [...data.keys()]
                    .sort()
                    .map((county) => html`<option>${county}</option>`)
                )
          )}
        </select>
        ${until(
          this.covidDataByCounty.then((data) => {
            const county = data.get(this.county as string);
            if (!county) return;
            return html`<covid-overview
              residents=${county.residents}
              cases=${county.cases}
              deaths=${county.deaths}
              cases7=${county.cases7}
              deaths7=${county.deaths7}
            ></covid-overview>`;
          }),
          html`<covid-overview></covid-overview>`
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "covid-county": CovidCounty;
  }
}
