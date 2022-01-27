import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
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
          @federalChanged=${(e: any) => {
            this.federal = e.detail;
            this.requestUpdate();
          }}
        ></covid-federal>
        ${this.federal
          ? html`<covid-county federal=${this.federal}></covid-county>`
          : html`<covid-county></covid-county>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "covid-stats": CovidStats;
  }
}
