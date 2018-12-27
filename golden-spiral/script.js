// Draws an approximation of the "golden spiral"
// https://en.wikipedia.org/wiki/Golden_ratio
// TODO: make this more recursively elegant

ITERATIONS = 16;

PHI = (1 + Math.sqrt(5)) / 2;

// return the dimensions of the next rectangle
function getBabyRect(width, height) {
    if (width > height) {
        return {
            width: width - height,
            height: height
        }
    } else {
        return {
            width: width,
            height: height - width
        }
    }
}

// visualize a rectangle object
function viz(r, level) {
    p = new Path.Rectangle(r);
    p.strokeColor = 'black';
    p.fillColor = {0: 'red', 1: 'green', 2: 'yellow', 3: 'blue'}[level % 4];
    
    length = Math.max(r.size.width, r.size.height);
    p.insertBelow(l);  // keep curve on top
}

// TODO: draw complete curve
// function continueCurve(path, r, level) {
//     start = path.lastSegment;
//     diff = point.x - start.x;

//     path.add(new Segment(
//         point,
//         new Point({
//             length: diff
//         }),
//         handle2
//     ));
// }

c = view.getViewSize();

// phi is a/b, a > b
// fit first rectangle to canvas
if (c.width/c.height >= PHI) {
    height = c.height - 20;
    size = new Size(height*PHI, height);
} else {
    size = new Size(c.width, c.width*PHI);
}

r = new Rectangle(new Point(0, 0), size);

// resize canvas to rectangle
// document.getElementById("art").width=r.size.width;
// document.getElementById("art").height=r.size.height;
view.viewSize = r.size.clone();
view.draw();
r.center = view.center;

// begin spiral
l = new Path();
l.strokeColor = 'white';
l.add(new Segment(
    r.point + new Size(0, r.size.height),
    new Point(0, r.size.height / 2),
    new Point(0, -r.size.height / 2)));
l.add(new Segment(
    r.point + new Size(r.size.height, 0),
    new Point(-r.size.height / 2, 0),
    r.point + new Size(r.size.height, 0),
    new Point(r.size.height / 2, 0)));
// l.fullySelected = true;
l.visible = false;

viz(r, 0);

// draw the rest of the spiral
parent = r;
for (i=1; i<ITERATIONS; i++) {
    size = new Size(getBabyRect(parent.width, parent.height));  // dimensions
    // get coordinates of top left or rectangle
    x = 0;
    y = 0;
    switch (i % 4) {
        case 1:
            x += parent.size.width - size.width;
            break;
        case 2:
            y += parent.size.height - size.height;
            break;
    }
    point = parent.point + new Size(x, y);
    parent = new Rectangle(point, size);
    console.debug('level '+i);
    console.debug(parent);

    viz(parent, i);
}
