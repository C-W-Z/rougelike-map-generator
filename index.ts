const CANVAS_SIZE: number = 500;
const CANVAS_CENTER = new Vec(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
const VERTEX_RADIUS = 2;
const EDGE_WIDTH = 1;
const VERTEX_COLOR = "black";
const EDGE_COLOR = "#604c39";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d');
const g = new ForceGraph(CANVAS_CENTER, CANVAS_SIZE / 2);

let animationId: number | null = null;
const vertexCount = 60;
const vertexForce = 1;
const pathCount = 8;
const deleteCount = 5;
const playPauseBtn = document.getElementById("play-pause");
const generateBtn = document.getElementById("generate");
const connectBtn = document.getElementById("connect");
const clearconnectBtn = document.getElementById("clearconnect");
const delaunayBtn = document.getElementById("delaunate");
const mstBtn = document.getElementById("mst");
const pathBtn = document.getElementById("path");
const mstpathBtn = document.getElementById("mst-path");
const newmapBtn = document.getElementById("newmap");

const locateImg = new Image();
const crossImg = new Image();
const compassImg = new Image();

function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = "#ad9064";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function redraw(forceGraph: boolean, delaunay: boolean = false, voronoi: boolean = false) {
    if (!ctx) return;
    clearCanvas();
    if (forceGraph)
        g.render(ctx, VERTEX_RADIUS, VERTEX_COLOR, EDGE_WIDTH, EDGE_COLOR);
    // draw start & end icon
    if (g.start !== null && g.end !== null) {
        let p = g.vertices[g.start];
        ctx.drawImage(locateImg, p.x - 16, p.y - 32, 32, 32);
        p = g.vertices[g.end];
        ctx.drawImage(crossImg, p.x - 16, p.y - 16, 32, 32);
    }
    // draw compass icon
    ctx.drawImage(compassImg, CANVAS_SIZE - 64 - 16, 16, 64, 64);
}

function renderLoop() {
    g.iterate(vertexForce);

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
    locateImg.src = "img/locate.png";
    crossImg.src = "img/cross.png";
    compassImg.src = "img/compass.png";

    generateBtn?.addEventListener("click", event => {
        g.randomGenerate(vertexCount);
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

    delaunayBtn?.addEventListener("click", event => {
        g.delaunate();
        redraw(true, false, false);
    });

    mstBtn?.addEventListener("click", event => {
        g.buildMST();
        redraw(true);
    });

    pathBtn?.addEventListener("click", event => {
        g.buildPaths(pathCount);
        redraw(true);
    });

    mstpathBtn?.addEventListener("click", event => {
        g.buildMSTPaths(pathCount);
        redraw(true);
    })

    newmapBtn?.addEventListener("click", event => {
        g.randomGenerate(vertexCount);
        for (let i = 0; i < 100; i++)
            g.iterate(vertexForce);
        g.delaunate();
        for (let i = 0; i < 100; i++)
            g.iterate(vertexForce);
        g.delaunate();
        g.buildMSTPaths(pathCount);
        for (let i = 0; i < 100; i++)
            g.iterate(vertexForce);
        g.delaunate();
        g.buildMSTPaths(pathCount);
        g.randomDeleteEdge(deleteCount);
        g.fixPathEnd();
        g.calculateFitness();
        redraw(true);
    })

    playPauseBtn?.addEventListener("click", event => {
        if (isPaused())
            play();
        else
            pause();
    });

    clearCanvas();
}

setup();
pause();
