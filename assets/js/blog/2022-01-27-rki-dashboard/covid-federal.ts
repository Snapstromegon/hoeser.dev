import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

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

  @state()
  covidDataByFederal = loadCovidDataByFederal().then((data) => {
    if (!this.federal) this.updateFederal([...data.keys()].sort()[0] as string);
    return data;
  });

  @state()
  federal?: string;

  updateFederal(federal: string) {
    this.federal = federal;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("federalChanged", { bubbles: false, detail: federal })
    );
  }

  override render() {
    return html`
      <div id="wrapper">
        <select @input=${(e: any) => this.updateFederal(e.target.value)}>
          ${until(
            this.covidDataByFederal.then((data) =>
              [...data.keys()]
                .sort()
                .map((federal) => html`<option>${federal}</option>`)
            )
          )}
        </select>
        ${until(
          this.covidDataByFederal.then((data) => {
            const federal = data.get(this.federal as string);
            if (!federal) return;
            return html`<covid-overview
              residents=${federal.residents}
              cases=${federal.cases}
              deaths=${federal.deaths}
              cases7=${federal.cases7}
              deaths7=${federal.deaths7}
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
    "covid-federal": CovidFederal;
  }
}
