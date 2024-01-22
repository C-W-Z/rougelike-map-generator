class DSU {
    public set: { p: number, r: number }[];
    constructor(size: number) {
        this.set = [];
        for (let i = 0; i < size; i++)
            this.set.push({ p: i, r: 0});
    }
    Find(x: number) {
        // path compression
        if (this.set[x].p != x)
            this.set[x].p = this.Find(this.set[x].p);
        return this.set[x].p;
    }
    Union(a: number, b: number) {
        // union by rank
        if (this.set[a].r > this.set[b].r)
            this.set[b].p = a;
        else {
            this.set[a].p = b;
            if (this.set[a].r == this.set[b].r)
                this.set[b].r++;
        }
    }
}

class ForceGraph {
    private center: Vec;
    private expectedSize: number;
    private _vertices: Vec[];
    // adjacent[i] => adjacent vertices id of vertex i
    private adjacent: number[][];
    private matrix: boolean[][];
    constructor(center: Vec, expectedSize: number) {
        this.center = center;
        this.expectedSize = expectedSize;
        this._vertices = [];
        this.adjacent = [];
        this.matrix = [];
    }
    public get vertices() {
        return this._vertices;
    }
    public clearEdges() {
        for (let i = 0; i < this._vertices.length; i++)
        {
            this.adjacent[i] = [];
            for (let j = 0; j < this._vertices.length; j++) {
                this.matrix[i][j] = false;
                this.matrix[j][i] = false;
            }
        }
    }
    private connected(i: number, j: number) {
        return this.matrix[i][j];
    }
    public connect(i: number, j: number) {
        if (this.connected(i, j))
            return;
        this.adjacent[i].push(j);
        this.adjacent[j].push(i);
        this.matrix[i][j] = true;
        this.matrix[j][i] = true;
    }
    public randomGenerate(generateCount: number) {
        this._vertices = [];
        this.adjacent = [];
        this.matrix = [];
        // 隨機生成 Vertices
        for (let i = 0; i < generateCount; i++)
        {
            this._vertices.push(
                Vec.add(this.center, new Vec(
                    Math.random() * this.expectedSize - this.expectedSize / 2,
                    Math.random() * this.expectedSize - this.expectedSize / 2
            )));
            this.adjacent.push([]);
            this.matrix.push([]);
            for (let j = 0; j < this._vertices.length; j++)
                this.matrix[i].push(false);
        }
    }
    public randomConnect(connectChance: number) {
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
    public iterate(moveSpeed: number) {
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
    public render(ctx: CanvasRenderingContext2D | null) {
        if (!ctx) return;
        // draw egdes
        for (let i = 0; i < this._vertices.length - 1; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j))
                    drawLine(ctx, this._vertices[i], this._vertices[j], "green", 1);
        // draw vertices
        for (const v of this._vertices)
            drawCircle(ctx, v, 2, "black");
    }
    public buildMST() {
        //            weight  vertex  vertex
        const edges: [number, number, number][] = [];
        for (let i = 0; i < this._vertices.length; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j))
                    edges.push([Vec.distance(this._vertices[i], this._vertices[j]), i, j]);
        // sort by weight(distance) increasingly
        edges.sort((e1, e2) => {
            if (e1[0] > e2[0])
                return 1;
            if (e1[0] < e2[0])
                return -1;
            return 0;
        });
        this.clearEdges();
        const dsu = new DSU(edges.length);
        for (let i = 0; i < edges.length; i++)
        {
            let a = dsu.Find(edges[i][1]);
            let b = dsu.Find(edges[i][2]);
            if (a != b) // if a & b are not the same set
            {
                dsu.Union(a, b);
                // build MST
                this.connect(edges[i][1], edges[i][2]);
            }
        }
    }
}
