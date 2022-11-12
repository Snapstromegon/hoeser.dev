import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("pwa-installer")
export default class PWAInstaller extends LitElement {
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
    }
    #download-icon {
      height: 1.2rem;
    }
  `;

  @state()
  deferredPrompt: any;

  constructor() {
    super();
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.requestUpdate();
    });
  }

  override render() {
    if (!this.deferredPrompt) return;
    return html`<button @click=${() => this.deferredPrompt.prompt()}>
      <!-- <span class="download-icon">⭳</span> Add to Homescreen -->
      <svg
        id="download-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
      Install PWA
    </button>`;
  }
}
