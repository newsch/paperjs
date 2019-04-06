"use strict";

let SEED; // seed for RNG

let STROKE = 20;
let OFFSET = STROKE;

function ripple(point, stroke, offset) {
  function snap(val, step) {
    return Math.floor(val / step) * step;
  }
  let center = [point.x, point.y].map(v => snap(v, offset * 2));
  console.log("remapped ", point, "to ", center);
  let color = "black";

  let c;
  let r = stroke;
  let iter = 0;

  function getDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  }

  let s = paper.view.getViewSize();
  let maxR = Math.max(
    ...[[0, 0], [s.width, 0], [0, s.height], [s.width, s.height]].map(p1 =>
      getDistance(p1, center)
    )
  );
  console.debug(maxR);
  // debugger;
  do {
    console.log("foo");
    c = new paper.Path.Circle({
      center,
      radius: r,
      strokeColor: color,
      strokeWidth: stroke
    });
    r += offset + stroke;
    iter++;
    // break;
  } while (r < maxR && iter < 200);
  console.debug(iter);
  // for (let index = 0; index < array.length; index++) {
  //   const element = array[index];

  // }
}

function onMouseDown(event) {
  // If the position of the mouse is within the path,
  // set its fill color to red, otherwise set it to
  // black:
  // if (path.contains(event.point)) {
  //     path.fillColor = 'red';
  // } else {
  //     path.fillColor = 'black';
  // }
  console.log("triggered");
  console.log(event);
  ripple(event.point, STROKE, OFFSET);
}

// paper.onMouseDown = onMouseDown;

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
// window.addEventListener("load", () => updatePermishlink());

function updateDownload(id = "download") {
  document.getElementById("download").addEventListener("click", () => {
    downloadProject(paper.project);
  });
}
window.addEventListener("load", () => updateDownload());

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
  () =>
    initCanvas(document.getElementById("art"), () => {
      paper.install(window);
      var tool = new paper.Tool();
      tool.onMouseDown = onMouseDown;
      let c = paper.view.getViewSize();
      // tool.activate();
      let r = (x, y) => ripple(new paper.Point(x, y), STROKE, OFFSET);
      // r(0, 0);
      // r(0, c.height);
      // r(c.width, 0);
      // r(c.width, c.height);

      // r(0, c.height / 2);
      // r(c.width, c.height / 2);

      // paper.onMouseDown = onMouseDown;
    }),
  false
);

// window.addEventListener(
//   "resize",
//   () => {
//     paper.project.activeLayer.children = []; // clear canvas
//     oriole();
//   },
//   false
// );

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

function downloadProject(project) {
  const fileName = "ripple.svg";
  const url =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(project.exportSVG({ asString: true }));
  var link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  // link.remove();
  // console.log(link);
}
