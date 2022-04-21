import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./covid-county";
import "./covid-federal";
import "./covid-nation";
import { loadNationOverview } from "./covidDataLoader";

@customElement("covid-stats")
export default class CovidStats extends LitElement {
  static override styles = css`
    #wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `;
  constructor() {
    super();
    loadNationOverview().then((data: any) => (this.covidDataNation = data));
  }

  @state()
  covidDataNation?: Awaited<ReturnType<typeof loadNationOverview>>;

  @state()
  federal: string = "";

  override render() {
    console.log(this.covidDataNation);
    return html`
      <div id="wrapper">
        <covid-nation></covid-nation>
        <covid-federal
          @federalChanged=${(e: any) => (this.federal = e.detail)}
        ></covid-federal>
        <covid-county federal=${ifDefined(this.federal)}></covid-county>
        <p>Last data update: ${this.covidDataNation?.updated.toLocaleDateString()}</p>
      </div>
    `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "covid-stats": CovidStats;
//   }
// }
