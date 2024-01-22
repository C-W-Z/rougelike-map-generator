/* https://openhome.cc/Gossip/P5JS/Delaunay.html */
function circumcircle(triangle: Vec[]) {
    const [p1, p2, p3] = triangle;
    const v1 = Vec.sub(p2, p1);
    const v2 = Vec.sub(p3, p2);
    const d1 = Vec.add(p2, p1).mult(0.5).dot(v1);
    const d2 = Vec.add(p3, p2).mult(0.5).dot(v2);
    const det = -Vec.cross(v1, v2).z;
    if (det !== 0) {
        const x = (d2 * v1.y - d1 * v2.y) / det;
        const y = (d1 * v2.x - d2 * v1.x) / det;
        const center = new Vec(x, y);
        const v = Vec.sub(p1, center);
        const radius = v.mag();
        const rr = v.sqrMag();
        return { center, radius, rr };
    }
    return null;
}

const CANVAS_SIZE: number = 500;
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;
const ctx = canvas.getContext('2d');

if (ctx) {
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

const triangle: Vec[] = [];
for (let i = 0; i < 3; i++)
    triangle.push(new Vec(randomInt(5, CANVAS_SIZE - 5), randomInt(5, CANVAS_SIZE - 5)));

const c = circumcircle(triangle);
if (c) {
    drawCircle(ctx, c.center, c.radius, null, "black", 1);
    drawCircle(ctx, c.center, 1, "black");
}

drawLine(ctx, triangle[0], triangle[1], "black", 1);
drawLine(ctx, triangle[1], triangle[2], "black", 1);
drawLine(ctx, triangle[2], triangle[0], "black", 1);
