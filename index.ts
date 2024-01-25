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
let vertexCount = 50;
let vertexForce = 1.5;
let maxIteration = 100;
let pathCount = 12;
let deleteCount = 5;
const vertexCountSlider = document.getElementById("vertexCount") as HTMLInputElement;
const vertexCountText = document.getElementById("vertexCount-text");
const vertexForceSlider = document.getElementById("vertexForce") as HTMLInputElement;
const vertexForceText = document.getElementById("vertexForce-text");
const maxIterationSlider =  document.getElementById("maxIteration") as HTMLInputElement;
const maxIterationText = document.getElementById("maxIteration-text");
const iterationText = document.getElementById("iteration-text");
const pathCountSlider = document.getElementById("pathCount") as HTMLInputElement;
const pathCountText = document.getElementById("pathCount-text");
const deleteCountSlider = document.getElementById("deleteCount") as HTMLInputElement;
const deleteCountText = document.getElementById("deleteCount-text");

const playPauseBtn = document.getElementById("play-pause");
const generateBtn = document.getElementById("generate");
const delaunayBtn = document.getElementById("delaunate");
const mstBtn = document.getElementById("mst");
const pathBtn = document.getElementById("path");
const mstpathBtn = document.getElementById("mst-path");
const deleteedgeBtn = document.getElementById("deleteedge");
const roomtypeBtn = document.getElementById("roomtype");
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

let iteration = 0;
function renderLoop() {
    if (iteration >= maxIteration) {
        pause();
        return;
    }
    iteration++;
    if (iterationText)
        iterationText.textContent = `Iteration: ${iteration}`;

    g.iterate(vertexForce);

    redraw();

    animationId = requestAnimationFrame(renderLoop);
};

function isPaused() {
    return animationId === null;
}

function play() {
    if (playPauseBtn)
        playPauseBtn.textContent = "Stop Iteration";
    iteration = 0;
    renderLoop();
}

function pause() {
    if (playPauseBtn)
        playPauseBtn.textContent = "Start Iteration";
    if (animationId)
        cancelAnimationFrame(animationId);
    animationId = null;
}

function setup() {
    for (let i = 0; i < RoomFreq.length; i++) {
        MapIcons.push(new Image());
        MapIcons[i].onload = redraw;
    }
    locateImg.onload = redraw;
    compassImg.onload = redraw;
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

    if (vertexCountText) {
        vertexCountText.textContent = vertexCount.toString();
        vertexCountSlider.value = vertexCount.toString();
        vertexCountSlider.addEventListener("input", event => {
            vertexCountText.textContent = vertexCountSlider.value;
            vertexCount = parseInt(vertexCountSlider.value);
        });
    }

    if (vertexForceText) {
        vertexForceText.textContent = vertexForce.toString();
        vertexForceSlider.value = vertexForce.toString();
        vertexForceSlider.addEventListener("input", event => {
            vertexForceText.textContent = vertexForceSlider.value;
            vertexForce = parseFloat(vertexForceSlider.value);
        });
    }

    if (maxIterationText) {
        maxIterationText.textContent = maxIteration.toString();
        maxIterationSlider.value = maxIteration.toString();
        maxIterationSlider.addEventListener("input", event => {
            maxIterationText.textContent = maxIterationSlider.value;
            maxIteration = parseInt(maxIterationSlider.value);
        });
    }

    if (pathCountText) {
        pathCountText.textContent = pathCount.toString();
        pathCountSlider.value = pathCount.toString();
        pathCountSlider.addEventListener("input", event => {
            pathCountText.textContent = pathCountSlider.value;
            pathCount = parseInt(pathCountSlider.value);
        });
    }

    if (deleteCountText) {
        deleteCountText.textContent = deleteCount.toString();
        deleteCountSlider.value = deleteCount.toString();
        deleteCountSlider.addEventListener("input", event => {
            deleteCountText.textContent = deleteCountSlider.value;
            deleteCount = parseInt(deleteCountSlider.value);
        });
    }

    mstBtn?.setAttribute('disabled', '');
    pathBtn?.setAttribute('disabled', '');
    mstpathBtn?.setAttribute('disabled', '');

    generateBtn?.addEventListener("click", event => {
        g.randomGenerate(vertexCount);
        m.clear();
        redraw();
        mstBtn?.setAttribute('disabled', '');
        pathBtn?.setAttribute('disabled', '');
        mstpathBtn?.setAttribute('disabled', '');
        deleteedgeBtn?.setAttribute('disabled', '');
        roomtypeBtn?.setAttribute('disabled', '');
    });

    playPauseBtn?.addEventListener("click", event => {
        if (isPaused())
            play();
        else
            pause();
    });

    delaunayBtn?.addEventListener("click", event => {
        g.delaunate();
        m.clear();
        redraw();
        mstBtn?.removeAttribute('disabled');
        pathBtn?.removeAttribute('disabled');
        mstpathBtn?.removeAttribute('disabled');
        roomtypeBtn?.removeAttribute('disabled');
        deleteedgeBtn?.removeAttribute('disabled');
    });

    mstBtn?.addEventListener("click", event => {
        g.buildMST();
        m.clear();
        redraw();
        mstBtn?.setAttribute('disabled', '');
        pathBtn?.setAttribute('disabled', '');
        mstpathBtn?.setAttribute('disabled', '');
    });

    pathBtn?.addEventListener("click", event => {
        g.buildPaths(pathCount);
        m.clear();
        redraw();
        mstBtn?.setAttribute('disabled', '');
        pathBtn?.setAttribute('disabled', '');
        mstpathBtn?.setAttribute('disabled', '');
    });

    mstpathBtn?.addEventListener("click", event => {
        g.buildMSTPaths(pathCount);
        m.clear();
        redraw();
        mstBtn?.setAttribute('disabled', '');
        pathBtn?.setAttribute('disabled', '');
        mstpathBtn?.setAttribute('disabled', '');
    });

    deleteedgeBtn?.addEventListener("click", event => {
        g.randomDeleteEdge(deleteCount);
        redraw();
    });

    roomtypeBtn?.addEventListener("click", event => {
        m.decideRoomTypes(g);
        redraw();
    });

    newmapBtn?.addEventListener("click", event => {
        m.generate(g, vertexCount, vertexForce, maxIteration, pathCount, deleteCount);
        m.decideRoomTypes(g);
        redraw();
        mstBtn?.setAttribute('disabled', '');
        pathBtn?.setAttribute('disabled', '');
        mstpathBtn?.setAttribute('disabled', '');
    });

    clearCanvas();
    newmapBtn?.click();
}

setup();
pause();
