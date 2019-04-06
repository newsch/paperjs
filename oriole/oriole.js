"use strict";
// several varieties of simple radial patterns

let REPETITIONS = 13; // how many diatoms to draw
let SEED; // seed for RNG
let diatoms = []; // to be filled with diatom parameters

let p = new window.URL(document.location).searchParams;
if (p.get("num") !== null) {
  let num = parseInt(p.get("num"));
  if (num != NaN) {
    REPETITIONS = num;
    console.debug("Repetitions set from query parameters");
  }
}
if (p.get("seed") !== null) {
  SEED = p.get("seed");
} else {
  SEED = Math.random().toString();
}
Math.seedrandom(SEED);
console.info(`random seed: ${SEED}`);

function updatePermishlink(id = "permishlink") {
  document.getElementById(id).href = `?seed=${SEED}`;
}
window.addEventListener("load", () => updatePermishlink());

// rng for inclusive ranges of ints (Math.random returns between [0,1))
function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

// prep page
function initCanvas(canvas, drawFunc) {
  paper.setup(canvas);
  drawFunc();
}

window.addEventListener(
  "load",
  () => initCanvas(document.getElementById("art"), oriole),
  false
);

window.addEventListener(
  "resize",
  () => {
    paper.project.activeLayer.children = []; // clear canvas
    oriole();
  },
  false
);

// drawing
function oriole() {
  function getColor(min = 0, max = 360, step = 30) {
    return new paper.Color({
      hue: random(min / step, max / step) * step,
      saturation: 0.8,
      lightness: 0.35
    });
  }
  let c = paper.view.getViewSize();
  const NUM_STRIPES = 60;
  const STRIPE_WIDTH = c.width / NUM_STRIPES;
  let stripe_size = new paper.Size(STRIPE_WIDTH, c.height);
  let color1 = getColor(),
    color2 = getColor(),
    color1len = 0,
    color2len = 0;
  for (let i = 0; i < NUM_STRIPES; i++) {
    let p = new paper.Point(STRIPE_WIDTH * i, 0);
    let r = new paper.Path.Rectangle(p, stripe_size);
    while (color1len == 0 || color1.hue == color2.hue) {
      color1 = getColor();
      color1len = random(1, 5);
    }
    while (color2len == 0 || color1.hue == color2.hue) {
      color2 = getColor();
      color2len = random(1, 5);
    }
    // r.strokeColor = "black";
    if (i % 2 == 0) {
      r.fillColor = color1;
      color1len--;
    } else {
      r.fillColor = color2;
      color2len--;
    }
  }
}

function getRandomParams() {
  let minRad = 2;
  let maxTotalRad = 40;
  let iter = random(3, 45);
  let angle = 360 / iter;
  let r1 = random(minRad, maxTotalRad / (tand(angle / 2) + 1));
  let totalRadLimit = maxTotalRad - r1;
  let touchLimit = Math.ceil(tand(angle / 2) * r1);
  let r2 = random(touchLimit, totalRadLimit);
  return { iter, r1, r2 };
}

function downloadDiatom(params) {
  // create a diatom from a representation
  let c = document.createElement("canvas");
  c.width = 100;
  c.height = 100;
  initCanvas(c, () => {
    diatomFromRepr(params)(paper.view.center);

    const fileName = "diatom.svg";
    const url =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(paper.project.exportSVG({ asString: true }));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    // link.remove();
    // console.log(link);
  });
}
