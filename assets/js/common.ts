import "@inventage/matomo-opt-out";
import "./common/pwa-install.js";

navigator.serviceWorker
  ?.register("/sw.js", { scope: "/" })
  .catch((error) => console.log("Registration failed with " + error));
