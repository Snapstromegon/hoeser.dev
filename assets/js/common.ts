import "./common/page-updated.js";
import "./common/pwa-install.js";

navigator.serviceWorker
  ?.register("/sw.js", { scope: "/" })
  .catch((error) => console.log(`Registration failed with ${error}`));


import { initializeFaro } from "@grafana/faro-web-sdk";

initializeFaro({
  app: {
    name: "hoeser.dev",
    version: "1.0.0",
  },
  url: "http://localhost:12347/collect",
});
