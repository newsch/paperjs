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
  document.getElementById(id).href = `?num=${REPETITIONS}&seed=${SEED}`;
}
window.addEventListener("load", () => updatePermishlink());

// helpful functions
function deg2rad(deg) {
  return (deg / 180) * Math.PI;
}

function sind(deg) {
  return Math.sin(deg2rad(deg));
}

function cosd(deg) {
  return Math.cos(deg2rad(deg));
}

function tand(deg) {
  return Math.tan(deg2rad(deg));
}

// rng for inclusive ranges of ints (Math.random returns between [0,1))
function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

// prep page
initCanvas = function(canvas, drawFunc) {
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  drawFunc();
  // Draw the view now:
  // paper.view.draw();
};

window.addEventListener(
  "load",
  () => {
    generateCanvases(REPETITIONS);
    console.log(
      "View diatom info with the output above, or using the `diatoms` global object, e.g. `diatoms[<number>]`."
    );
  },
  false
);

// drawing
function diatom(point, iter = 20, radius1 = 15, radius2 = 20) {
  for (var i = 0; i < iter; i++) {
    angle = (360 / iter) * i;
    offset = new paper.Point({ angle: angle, length: radius1 });
    c = new paper.Path.Circle(point.add(offset), radius2);
    c.strokeColor = "black";
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

function diatomFromRepr({ iter, r1, r2 }) {
  return point => diatom(point, iter, r1, r2);
}

function getSvgString(num) {
  if (num in diatoms) {
    return diatoms[num].project.exportSVG({ asString: true });
  } else {
    return new Error(`diatom ${num} does not exist`);
  }
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

function generateCanvases(num) {
  for (let i = 1; i <= num; i++) {
    let c = document.createElement("canvas");
    c.id = i;
    c.title = `#${i}`;
    document.getElementById("art-wall").append(c);

    const p = getRandomParams();
    initCanvas(c, () => diatom(paper.view.center, p.iter, p.r1, p.r2));

    // log and save diatom parameters
    let repr = {
      element: c,
      params: p,
      project: paper.project
    };
    console.debug(repr);
    diatoms[i] = repr;
  }
}
