const CANVAS_SIZE: number = 500;
const CANVAS_CENTER = new Vec(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
const VERTEX_RADIUS = 2;
const EDGE_WIDTH = 1;
const VERTEX_COLOR = "blue";
const EDGE_COLOR = "green";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d');
const g = new ForceGraph(CANVAS_CENTER, CANVAS_SIZE / 2);
let d: Delaunator;

let animationId: number | null = null;
const count = 50;
const chance = 0.1;
const force = 1;
const playPauseBtn = document.getElementById("play-pause");
const generateBtn = document.getElementById("generate");
const connectBtn = document.getElementById("connect");
const clearconnectBtn = document.getElementById("clearconnect");
const delaunayBtn = document.getElementById("delaunate");
const mstBtn = document.getElementById("mst");
const pathBtn = document.getElementById("path");
const mstpathBtn = document.getElementById("mst-path");

function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function redraw(forceGraph: boolean, delaunay: boolean = false, voronoi: boolean = false) {
    clearCanvas();
    if (forceGraph)
        g.render(ctx, VERTEX_RADIUS, VERTEX_COLOR, EDGE_WIDTH, EDGE_COLOR);
    if (delaunay || voronoi)
        d.render(delaunay, voronoi, ctx, VERTEX_RADIUS, VERTEX_COLOR, EDGE_WIDTH, EDGE_COLOR, 2, "red");
}

function renderLoop() {
    g.iterate(force);

    redraw(true);

    animationId = requestAnimationFrame(renderLoop);
};

function isPaused() {
    return animationId === null;
}

function play() {
    if (playPauseBtn)
        playPauseBtn.textContent = "Pause";
    renderLoop();
}

function pause() {
    if (playPauseBtn)
        playPauseBtn.textContent = "Play";
    if (animationId)
        cancelAnimationFrame(animationId);
    animationId = null;
}

function setup() {
    generateBtn?.addEventListener("click", event => {
        g.randomGenerate(25);
        redraw(true);
    });

    connectBtn?.addEventListener("click", event => {
        g.randomConnect(20, 5, CANVAS_SIZE / 3);
        redraw(true);
    });

    clearconnectBtn?.addEventListener("click", event => {
        g.clearEdges();
        redraw(true);
    })

    playPauseBtn?.addEventListener("click", event => {
        if (isPaused())
            play();
        else
            pause();
    });

    delaunayBtn?.addEventListener("click", event => {
        // delaunay triangulation
        d = new Delaunator(CANVAS_CENTER, CANVAS_SIZE, CANVAS_SIZE);
        for (const v of g.vertices)
            d.addPoint(v);
        // build egdes from delaunay
        g.clearEdges();
        d.indicesOfTriangles.forEach(tri => {
            g.connect(tri[0], tri[1]);
            g.connect(tri[1], tri[2]);
            g.connect(tri[2], tri[0]);
        });

        redraw(true, false, false);
    });

    mstBtn?.addEventListener("click", event => {
        g.buildMST();
        redraw(true);
    });

    pathBtn?.addEventListener("click", event => {
        g.buildPaths(3);
        redraw(true);
    });

    mstpathBtn?.addEventListener("click", event => {
        g.buildMSTPaths(3);
        redraw(true);
    })
}

setup();
play();
