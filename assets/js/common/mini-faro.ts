import {
  Metric,
  onCLS,
  onFCP,
  onFID,
  onINP,
  onLCP,
  onTTFB,
  ReportOpts,
} from "web-vitals";
import { version } from "../../../package.json" assert { type: "json" };

const MF_APP_NAME = "hoeser.dev";
const MF_APP_VERSION = version;
const MF_AGENT_URL = "https://app-agent.grafana.home.hoeser.dev/collect";
const MF_SESSION_STORAGE_ID = "mini-faro.sessionId";

const getReportMeta = () => ({
  app: {
    name: MF_APP_NAME,
    version: MF_APP_VERSION,
  },
  page: {
    url: window.location.href,
  },
  sessionId: sessionStorage.getItem("mini-faro-session-id"),
  view: {
    name: "default",
  },
});

const reportData = async (data: any) => {
  const response = await fetch(MF_AGENT_URL, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.log(`Failed to report data: ${response.status} - ${errorText}`);
  }
};

const reportWebVital = async (metric: Metric) => {
  const data = {
    measurements: [
      {
        context: {},
        timestamp: new Date().toISOString(),
        type: "web-vitals",
        values: {
          [metric.name.toLowerCase()]: metric.value,
        },
      },
    ],
    meta: getReportMeta(),
  };

  await reportData(data);
};

const reportEvent = async (
  name: string,
  date: Date = new Date(),
  attributes = {}
) => {
  const data = {
    events: [
      {
        attributes,
        domain: "browser",
        name,
        timestamp: date.toISOString(),
      },
    ],
    meta: getReportMeta(),
  };

  await reportData(data);
};

if (sessionStorage.getItem(MF_SESSION_STORAGE_ID) === null) {
  sessionStorage.setItem(MF_SESSION_STORAGE_ID, crypto.randomUUID());
  reportEvent("session_start");
}
reportEvent("view_changed");

const webVitalsOptions: ReportOpts = {
  reportAllChanges: true,
};

onCLS(reportWebVital, webVitalsOptions);
onFCP(reportWebVital, webVitalsOptions);
onINP(reportWebVital, webVitalsOptions);
onFID(reportWebVital, webVitalsOptions);
onLCP(reportWebVital, webVitalsOptions);
onTTFB(reportWebVital, webVitalsOptions);
