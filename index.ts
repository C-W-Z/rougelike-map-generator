const CANVAS_SIZE: number = 500;
const CANVAS_CENTER = new Vec(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
const VERTEX_RADIUS = 2;
const EDGE_WIDTH = 1;

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d');
const g = new ForceGraph(CANVAS_CENTER, CANVAS_SIZE / 4)
const d = new Delaunator(CANVAS_SIZE, CANVAS_SIZE);

function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawDelaunayVoronoi(delaunay: boolean, voronoi: boolean) {
    if (!ctx) return;

    if (delaunay) {
        // draw triangles' edges
        ctx.lineWidth = EDGE_WIDTH;
        ctx.strokeStyle = "green";
        ctx.beginPath();
        d.pointsOfTriangles.forEach(triangle => {
            ctx.moveTo(triangle[0].x, triangle[0].y);
            ctx.lineTo(triangle[1].x, triangle[1].y);
            ctx.lineTo(triangle[2].x, triangle[2].y);
            ctx.lineTo(triangle[0].x, triangle[0].y);
        });
        ctx.stroke();
    }

    if (voronoi) {
        // draw cells' edges
        ctx.lineWidth = EDGE_WIDTH;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        d.pointsOfVoronoiCells.forEach(pointsOfCell => {
            ctx.moveTo(pointsOfCell[0].x, pointsOfCell[0].y);
            for (let i = 1; i < pointsOfCell.length; i++)
                ctx.lineTo(pointsOfCell[i].x, pointsOfCell[i].y);
            ctx.lineTo(pointsOfCell[0].x, pointsOfCell[0].y);
        });
        ctx.stroke();
    }

    if (delaunay || voronoi) {
        // draw vertices
        ctx.fillStyle = "blue";
        ctx.beginPath();
        d.vertices.forEach(v => {
            ctx.arc(v.x, v.y, VERTEX_RADIUS, 0, 2 * Math.PI);
            ctx.closePath();
        });
        ctx.fill();
    }
}

canvas.onmousedown = (e) => {
    const p = getMousePos(canvas, e);
    d.addPoint(p);
    clearCanvas();
    drawDelaunayVoronoi(true, true);
}

clearCanvas();
