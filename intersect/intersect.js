"use strict";

function updateDownload(id = "download") {
  document.getElementById("download").addEventListener("click", () => {
    downloadProject(paper.project);
  });
}
window.addEventListener("load", () => updateDownload());

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
      draw();
    }),
  false
);

function draw() {
  let c = paper.view.getViewSize();
  let square = new paper.Path.Rectangle({
    topLeft: [50, 50],
    bottomRight: [150, 150],
    strokeColor: 'black'
  });
  let circle = new paper.Path.Circle({
    center: [175, 175],
    radius: 100,
    strokeColor: 'red'
  });
  let line = new paper.Path.Line({
    from: [100, 100],
    to: [200, 100],
    strokeColor: 'orange'
  })

  let crossingGroup = new paper.Group();

  let crossings = square.getCrossings(circle);

  for (const crossing of crossings) {
    console.log(crossing);
    new Path.Circle({
      center: crossing.point,
      radius: 4,
      fillColor: 'blue',
      parent: crossingGroup
    });
  }

  // debugger;
}

function trimPaths(cutter, paths) {

}

function downloadProject(project, fileName) {
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
