import "./common/page-updated.js";
import "./common/pwa-install.js";

navigator.serviceWorker
  ?.register("/sw.js", { scope: "/" })
  .catch((error) => console.log(`Registration failed with ${error}`));

// import("./common/mini-faro.js");
