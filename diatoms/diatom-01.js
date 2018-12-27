// varieties of simple radial art

// helpful functions
function deg2rad(deg) {
	return deg / 180 * Math.PI;
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


// prep page
initCanvas = function(canvas, drawFunc) {
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	drawFunc();
	// Draw the view now:
	paper.view.draw();
}

window.addEventListener('load', () => {
	initCanvas(document.getElementById('art-1'), main);
}, false);


// drawing
function diatom(point, iter=20, radius1=15, radius2=20) {
	for (var i=0; i < iter; i++) {
		angle = (360 / iter) * i;
		offset = new paper.Point({angle: angle, length: radius1});
		c = new paper.Path.Circle(point.add(offset), radius2);
		c.strokeColor = 'black';
	}
}

function main() {
	diatom(paper.view.center);
}
