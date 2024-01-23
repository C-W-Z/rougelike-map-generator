function randomInt(minInclusive: number, maxInclusive: number) {
    minInclusive = Math.ceil(minInclusive);
    maxInclusive = Math.floor(maxInclusive);
    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

function randomFloat(minInclusive: number, maxExclusive: number) {
    return Math.random() * (maxExclusive - minInclusive) + minInclusive;
}

function clamp(number: number, min: number, max: number) {
    return Math.max(min, Math.min(number, max));
}

function drawLine(ctx: CanvasRenderingContext2D | null, startPos: Vec, endPos: Vec, stroke: string, width: number) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D | null, center: Vec, radius: any, fill: string | null = null, stroke: string | null = null, strokeWidth: number | null = null) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke && strokeWidth) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function drawText(ctx: CanvasRenderingContext2D | null, pos: Vec, text: string, fontsize: number, textColor: string) {
    if (!ctx || fontsize < 0 || text == '') return;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.font = fontsize + 'px sans-serif';
    ctx.fillText(text, pos.x, pos.y);
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return new Vec(
        evt.clientX - rect.left,
        evt.clientY - rect.top
    );
}

function remove(array: any[], key: any) {
    const index = array.indexOf(key, 0);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
