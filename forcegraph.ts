class ForceGraph {
    private center: Vec;
    private expectedSize: number;
    private _vertices: Vec[];
    // adjacent[i] => adjacent vertices id of vertex i
    private adjacent: number[][];
    constructor(center: Vec, expectedSize: number) {
        this.center = center;
        this.expectedSize = expectedSize;
        this._vertices = [];
        this.adjacent = [];
    }
    public get vertices() {
        return this._vertices;
    }
    public clearEdges() {
        for (let i = 0; i < this.adjacent.length; i++)
            this.adjacent[i] = [];
    }
    private connected(i: number, j: number) {
        return this.adjacent[i].includes(j);
    }
    connect(i: number, j: number) {
        if (this.connected(i, j))
            return;
        this.adjacent[i].push(j);
        this.adjacent[j].push(i);
    }
    randomGenerate(generateCount: number) {
        this._vertices = []
        // 隨機生成 Vertices
        for (let i = 0; i < generateCount; i++)
        {
            this._vertices.push(
                Vec.add(this.center, new Vec(
                    Math.random() * this.expectedSize - this.expectedSize / 2,
                    Math.random() * this.expectedSize - this.expectedSize / 2
            )));
            this.adjacent.push([]);
        }
    }
    randomConnect(connectChance: number) {
        // 隨機連接 Vertices
        const distributionCap = connectChance * this._vertices.length;
        for (let i = 0; i < this._vertices.length - 1; i++) {
            const vi = this._vertices[i];
            if (this.adjacent[i].length >= distributionCap)
                continue;
            for (let j = i + 1; j < this._vertices.length; j++) {
                const vj = this._vertices[j];
                if (Math.random() <= connectChance)
                    this.connect(i, j);
            }
        }
    }
    private static move(vertex: Vec, pos: Vec, moveSpeed: number) {
        const dir = Vec.sub(vertex, pos).normalized();
        vertex.add(Vec.mult(dir, moveSpeed));
    }
    iterate(moveSpeed: number) {
        for (let i = 0; i < this._vertices.length; i++) {
            const vi = this._vertices[i];
            // vi move to center
            ForceGraph.move(vi, this.center, -moveSpeed * clamp((vi.mag() / this.expectedSize), 0, 1));
            for (let j = 0; j < this._vertices.length; j++) {
                const vj = this._vertices[j];
                if (i == j)
                    continue;
                const dist = Vec.distance(vi, vj) / this.expectedSize;
                if (this.connected(i, j))
                    // vi be pulled by vj if connected
                    ForceGraph.move(vi, vj, -moveSpeed * clamp(dist, 0, 1));
                // vi be pushed by vj
                ForceGraph.move(vi, vj, moveSpeed * (1 - clamp(dist, 0, 1)));
            }
        }
    }
    render(ctx: CanvasRenderingContext2D) {
        // draw egdes
        for (let i = 0; i < this._vertices.length - 1; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j))
                    drawLine(ctx, this._vertices[i], this._vertices[j], "green", 1);
        // draw vertices
        for (const v of this._vertices)
            drawCircle(ctx, v, 2, "black");
    }
}
