import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

import { loadNationOverview } from "./covidDataLoader";

import "./covid-overview";

@customElement("covid-nation")
export default class CovidNation extends LitElement {
  @state()
  covidDataNation = loadNationOverview();

  override render() {
    return html`
      ${until(
        this.covidDataNation.then(
          (data) =>
            html`<covid-overview
              residents=${data.residents}
              cases=${data.cases}
              deaths=${data.deaths}
              cases7=${data.cases7}
              deaths7=${data.deaths7}
            ></covid-overview>`
        ), html`<covid-overview></covid-overview>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "covid-nation": CovidNation;
  }
}
