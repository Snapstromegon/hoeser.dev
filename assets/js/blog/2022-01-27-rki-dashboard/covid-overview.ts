import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("covid-overview")
export default class CovidOverview extends LitElement {
  static override styles = css`
    #wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto;
      grid-template-areas: "incidence cases7 deaths7" "incidence cases deaths";
      gap: 0.5rem;
    }

    #incidence {
      grid-area: incidence;
    }

    #cases {
      grid-area: cases;
    }

    #cases7 {
      grid-area: cases7;
    }

    #deaths {
      grid-area: deaths;
    }

    #deaths7 {
      grid-area: deaths7;
    }

    #wrapper div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      height: 100%;
      background: #eee;
      padding: 0.5rem;
      box-sizing: border-box;
      color: #444;
      border-radius: 0.3rem;
    }

    .value {
      font-weight: bolder;
      color: #000;
    }
  `;

  @property({ type: Number })
  cases?: number;

  @property({ type: Number })
  deaths?: number;

  @property({ type: Number })
  cases7?: number;

  @property({ type: Number })
  deaths7?: number;

  @property({ type: Number })
  residents?: number;

  toPer100k(value?: number): number | undefined {
    if (!value || !this.residents) return;
    return (100_000 / this.residents) * value;
  }

  override render() {
    return html`
      <div id="wrapper">
        <div id="incidence">
          <span>7-Day incidence</span>
          <span class="value">
            ${this.toPer100k(this.cases7)?.toFixed(2) ?? "..."}
          </span>
        </div>
        <div id="cases7">
          <span>7-Day cases</span>
          <span class="value">${this.cases7 ?? "..."}</span>
        </div>
        <div id="deaths7">
          <span>7-Day deaths</span>
          <span class="value">${this.deaths7 ?? "..."}</span>
        </div>
        <div id="cases">
          <span>Total cases</span>
          <span class="value">${this.cases ?? "..."}</span>
        </div>
        <div id="deaths">
          <span>Total deaths</span>
          <span class="value">${this.deaths ?? "..."}</span>
        </div>
      </div>
    `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "covid-overview": CovidOverview;
//   }
// }
