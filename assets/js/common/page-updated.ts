import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("page-updated")
export default class PageUpdated extends LitElement {
  static override styles = css`
    button {
      cursor: pointer;
      border: 0.2rem solid transparent;
      background: linear-gradient(#fff, #fff),
        linear-gradient(to right, var(--theme-color-a), var(--theme-color-b));
      padding: 0.5rem 1rem 0.5rem 0.75rem;
      z-index: 1000;
      color: #000;
      border-radius: 0.3rem;
      background-origin: border-box;
      background-clip: padding-box, border-box;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      animation: slide-in .5s ease-in-out;
    }
    #update-icon {
      height: 1.2rem;
    }

    @keyframes slide-in {
      0% {
        transform: translateY(-300%);
      }
    }
  `;

  @state()
  isPageUpdatePending: boolean = false;

  override connectedCallback() {
    super.connectedCallback();
    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data.type === "CACHE_UPDATED") {
        this.isPageUpdatePending = true;
      }
    });
  }

  override render() {
    if (!this.isPageUpdatePending) return;
    return html`<button @click=${() => window.location.reload()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        id="update-icon"
      >
        <path
          d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Zm20.35-.75V36.1q3.8-1.45 6.05-4.825T37 23.85q0-2.4-1.175-4.875T32.75 14.6l-1.45-1.3v6.2h-3V8h11.5v3h-6.55l.75.7q3 2.8 4.5 6t1.5 6.15q0 5.3-3.1 9.55-3.1 4.25-8.2 5.85Z"
        />
      </svg>
      Page update available
    </button>`;
  }
}
