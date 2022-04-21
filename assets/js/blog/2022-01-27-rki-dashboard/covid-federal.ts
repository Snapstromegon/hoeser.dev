import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";

import { loadCovidDataByFederal } from "./covidDataLoader";

import "./covid-overview";

@customElement("covid-federal")
export default class CovidFederal extends LitElement {
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
    loadCovidDataByFederal().then((data) => {
      this.covidDataByFederal = data;
      this.updateFederal(this.availableFederalsSorted[0]);
    });
  }

  @state()
  covidDataByFederal?: Awaited<ReturnType<typeof loadCovidDataByFederal>>;

  @state()
  federal?: string;

  updateFederal(federal: string) {
    this.federal = federal;
    this.dispatchEvent(
      new CustomEvent("federalChanged", { bubbles: false, detail: federal })
    );
  }

  get availableFederalsSorted(): string[] {
    return [
      ...((this.covidDataByFederal || []).keys() as Iterable<string>),
    ].sort();
  }

  get federalData() {
    return this.covidDataByFederal?.get(this.federal as string);
  }

  override render() {
    return html`
      <div id="wrapper">
        <select @input=${(e: any) => this.updateFederal(e.target.value)}>
          ${repeat(
            this.availableFederalsSorted,
            (federal) => federal,
            (federal) => html`<option>${federal}</option>`
          )}
        </select>
        <covid-overview
          residents=${ifDefined(this.federalData?.residents)}
          cases=${ifDefined(this.federalData?.cases)}
          deaths=${ifDefined(this.federalData?.deaths)}
          cases7=${ifDefined(this.federalData?.cases7)}
          deaths7=${ifDefined(this.federalData?.deaths7)}
        ></covid-overview>
      </div>
    `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "covid-federal": CovidFederal;
//   }
// }
