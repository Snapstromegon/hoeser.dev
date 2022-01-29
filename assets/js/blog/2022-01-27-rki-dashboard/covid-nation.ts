import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { loadNationOverview } from "./covidDataLoader";

import "./covid-overview";

@customElement("covid-nation")
export default class CovidNation extends LitElement {
  constructor() {
    super();
    loadNationOverview().then((data: any) => (this.covidDataNation = data));
  }

  @state()
  covidDataNation?: Awaited<ReturnType<typeof loadNationOverview>>;

  override render() {
    return html`
      <covid-overview
        residents=${ifDefined(this.covidDataNation?.residents)}
        cases=${ifDefined(this.covidDataNation?.cases)}
        deaths=${ifDefined(this.covidDataNation?.deaths)}
        cases7=${ifDefined(this.covidDataNation?.cases7)}
        deaths7=${ifDefined(this.covidDataNation?.deaths7)}
      ></covid-overview>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "covid-nation": CovidNation;
  }
}
