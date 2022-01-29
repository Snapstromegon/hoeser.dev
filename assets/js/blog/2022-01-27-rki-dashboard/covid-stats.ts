import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "./covid-county";
import "./covid-federal";
import "./covid-nation";

@customElement("covid-stats")
export default class CovidStats extends LitElement {
  static override styles = css`
    #wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `;

  @state()
  federal: string = "";

  override render() {
    return html`
      <div id="wrapper">
        <covid-nation></covid-nation>
        <covid-federal
          @federalChanged=${(e: any) => (this.federal = e.detail)}
        ></covid-federal>
        <covid-county federal=${ifDefined(this.federal)}></covid-county>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "covid-stats": CovidStats;
  }
}
