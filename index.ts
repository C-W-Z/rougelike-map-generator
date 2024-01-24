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
const m = new RandomMap();

let animationId: number | null = null;
const vertexCount = 50;
const vertexForce = 1.5;
const pathCount = 12;
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

const MapIcons: HTMLImageElement[] = new Array();
const compassImg = new Image();
const locateImg = new Image();

function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = "#ad9064";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function redraw() {
    if (!ctx) return;
    clearCanvas();
    g.render(ctx, VERTEX_RADIUS, VERTEX_COLOR, EDGE_WIDTH, EDGE_COLOR);
    // draw start & end icon
    if (m.roomType.length == g.vertices.length && g.start !== null) {
        m.render(ctx, g.vertices, MapIcons);
        // draw location pin icon
        ctx.drawImage(locateImg, g.vertices[g.start].x - 16, g.vertices[g.start].y - 32, 32, 32);
        // draw compass icon
        ctx.drawImage(compassImg, CANVAS_SIZE - 64 - 16, 16, 64, 64);
    }
}

function renderLoop() {
    g.iterate(vertexForce);

    redraw();

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
    for (let i = 0; i < RoomFreq.length; i++) {
        MapIcons.push(new Image());
        MapIcons[i].onload = redraw;
    }
    MapIcons[0].src = "img/flag.png";
    MapIcons[1].src = "img/skull.png";
    MapIcons[2].src = "img/enemy.png";
    MapIcons[3].src = "img/key.png";
    MapIcons[4].src = "img/money.png";
    MapIcons[5].src = "img/bonfire.png";
    MapIcons[6].src = "img/question-mark.png";
    MapIcons[7].src = "img/rune.png";
    MapIcons[8].src = "img/cross.png";
    locateImg.src = "img/locate.png";
    compassImg.src = "img/compass.png";

    generateBtn?.addEventListener("click", event => {
        g.randomGenerate(vertexCount);
        m.clear();
        redraw();
    });

    connectBtn?.addEventListener("click", event => {
        g.randomConnect(20, 5, CANVAS_SIZE / 3);
        m.clear();
        redraw();
    });

    clearconnectBtn?.addEventListener("click", event => {
        g.clearEdges();
        m.clear();
        redraw();
    })

    delaunayBtn?.addEventListener("click", event => {
        g.delaunate();
        m.clear();
        redraw();
    });

    mstBtn?.addEventListener("click", event => {
        g.buildMST();
        m.clear();
        redraw();
    });

    pathBtn?.addEventListener("click", event => {
        g.buildPaths(pathCount);
        m.clear();
        redraw();
    });

    mstpathBtn?.addEventListener("click", event => {
        g.buildMSTPaths(pathCount);
        m.clear();
        redraw();
    })

    newmapBtn?.addEventListener("click", event => {
        m.generate(g);
        m.decideRoomTypes(g);
        redraw();
    })

    playPauseBtn?.addEventListener("click", event => {
        if (isPaused())
            play();
        else
            pause();
    });

    clearCanvas();
    newmapBtn?.click();
}

setup();
pause();
