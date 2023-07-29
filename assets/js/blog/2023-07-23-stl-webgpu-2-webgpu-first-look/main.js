const firstCanvas = document.getElementById("demo_first");
const DEMO_SIZE = 9;
const firstContext = firstCanvas.getContext("2d");
firstCanvas.width = DEMO_SIZE;
firstCanvas.height = DEMO_SIZE;

const center = {
  x: (DEMO_SIZE - 1) / 2,
  y: (DEMO_SIZE - 1) / 2,
};

const getPixelColor = (x, y, demoSize) => {
  const middle = Math.floor(demoSize / 2);
  const distanceX = Math.abs(x - middle) / middle;
  const distanceY = Math.abs(y - middle) / middle;
  const diagonal = (x + y) / demoSize / 2;
  return {
    r: 1 - distanceX,
    g: 1 - distanceY,
    b: 1 - diagonal,
  };
};

for (let row = 0; row < DEMO_SIZE; row++) {
  for (let col = 0; col < DEMO_SIZE; col++) {
    const color = getPixelColor(row, col, DEMO_SIZE);
    firstContext.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${
      color.b * 255
    })`;
    firstContext.fillRect(row, col, 1, 1);
  }
}

const applyHighlight = (shiki, lines) => {
  const shikiLines = shiki.querySelectorAll(".line");
  shikiLines.forEach((line, index) => {
    if (lines.includes(index + 1)) {
      line.classList.add("sh--highlight");
    } else {
      line.classList.remove("sh--highlight");
    }
  });
};

const codeHighlightSteps = [[2], [3], [4], [5], [6, 7, 8, 9, 10]];

const demoCPUCode = document.querySelector("#demo_cpu .shiki");
const demoCPUCanvas = document.querySelector("#demo_cpu_canvas");
const demoCPUCtx = demoCPUCanvas.getContext("2d");
demoCPUCanvas.width = DEMO_SIZE;
demoCPUCanvas.height = DEMO_SIZE;

let demoCPUPixel = 0;
let demoCPUStep = -1;

function renderNextCPUPixel() {
  demoCPUStep = (demoCPUStep + 1) % (codeHighlightSteps.length + 1);
  const col = demoCPUPixel % DEMO_SIZE;
  const row = Math.floor(demoCPUPixel / DEMO_SIZE);
  demoCPUCtx.fillStyle = "#fff";
  demoCPUCtx.fillRect(col, row, 1, 1);
  applyHighlight(demoCPUCode, codeHighlightSteps[demoCPUStep] || []);
  if (demoCPUStep === codeHighlightSteps.length) {
    if (demoCPUPixel === 0) {
      demoCPUCtx.clearRect(0, 0, DEMO_SIZE, DEMO_SIZE);
    }
    const color = getPixelColor(col, row, DEMO_SIZE);
    demoCPUCtx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${
      color.b * 255
    })`;
    demoCPUCtx.fillRect(col, row, 1, 1);
    demoCPUPixel = (demoCPUPixel + 1) % DEMO_SIZE ** 2;
    if (demoCPUPixel != 0) {
      setTimeout(renderNextCPUPixel, 200);
    }
  } else {
    setTimeout(renderNextCPUPixel, 200);
  }
}

document.querySelector("#start_cpu_render").addEventListener("click", () => {
  demoCPUCtx.clearRect(0, 0, DEMO_SIZE, DEMO_SIZE);
  renderNextCPUPixel();
});

const demoGPUCode = document.querySelector("#demo_gpu .shiki");
const demoGPUCanvas = document.querySelector("#demo_gpu_canvas");
const demoGPUCtx = demoGPUCanvas.getContext("2d");
demoGPUCanvas.width = DEMO_SIZE;
demoGPUCanvas.height = DEMO_SIZE;

let demoGPUStep = -1;

function renderNextGPUPixel() {
  demoGPUStep = (demoGPUStep + 1) % (codeHighlightSteps.length + 1);
  applyHighlight(demoGPUCode, codeHighlightSteps[demoGPUStep] || []);
  for (let i = 0; i < DEMO_SIZE ** 2; i++) {
    const col = i % DEMO_SIZE;
    const row = Math.floor(i / DEMO_SIZE);
    let color = getPixelColor(col, row, DEMO_SIZE);
    switch (demoGPUStep) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        color = { r: 1, g: 1, b: 1 };
        break;
    }
    demoGPUCtx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${
      color.b * 255
    })`;
    demoGPUCtx.fillRect(col, row, 1, 1);
  }
  if (demoGPUStep < codeHighlightSteps.length) {
    setTimeout(renderNextGPUPixel, 200);
  }
}

document.querySelector("#start_gpu_render").addEventListener("click", () => {
  renderNextGPUPixel();
});
