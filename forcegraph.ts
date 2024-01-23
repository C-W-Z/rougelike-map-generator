class DSU {
    private set: { p: number, r: number }[];
    constructor(size: number) {
        this.set = [];
        for (let i = 0; i < size; i++)
            this.set.push({ p: i, r: 0 });
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

class Heap {
    /* reference: https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript */
    private heap: any[];
    private comparator: (a: any, b: any) => boolean;
    private top: number = 0;
    private static parent = (i: number) => ((i + 1) >>> 1) - 1;
    private static left = (i: number) => (i << 1) + 1;
    private static right = (i: number) => (i + 1) << 1;
    constructor(comparator: (a: any, b: any) => boolean = (a: number, b: number) => a > b) {
        this.heap = [];
        this.comparator = comparator;
    }
    public size() {
        return this.heap.length;
    }
    public empty() {
        return this.size() == 0;
    }
    public peek() {
        return this.heap[this.top];
    }
    public push(...values: any[]) {
        values.forEach(value => {
            this.heap.push(value);
            this.siftUp();
        });
        return this.size();
    }
    public pop() {
        const res = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top)
            this.swap(this.top, bottom);
        this.heap.pop();
        this.siftDown();
        return res;
    }
    public replace(value: any) {
        const replacedValue = this.peek();
        this.heap[this.top] = value;
        this.siftDown();
        return replacedValue;
    }
    private greater(i: number, j: number) {
        return this.comparator(this.heap[i], this.heap[j]);
    }
    private swap(i: number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    private siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this.greater(node, Heap.parent(node))) {
            this.swap(node, Heap.parent(node));
            node = Heap.parent(node);
        }
    }
    private siftDown() {
        let node = this.top;
        while ( (Heap.left(node) < this.size() && this.greater(Heap.left(node), node)) ||
                (Heap.right(node) < this.size() && this.greater(Heap.right(node), node))) {
            let maxChild = (Heap.right(node) < this.size() && this.greater(Heap.right(node), Heap.left(node))) ? Heap.right(node) : Heap.left(node);
            this.swap(node, maxChild);
            node = maxChild;
        }
    }
}

class ForceGraph {
    private center: Vec;
    private expectedSize: number;
    private _vertices: Vec[]; // the coordinates of vertices
    private adjacent: number[][]; // adjacent[i] => adjacent vertices id of vertex i
    private matrix: boolean[][]; // adjacency matrix
    private pathEnd: [number | null, number | null] = [null, null];
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
        for (let i = 0; i < this._vertices.length; i++) {
            this.adjacent[i] = [];
            for (let j = 0; j < this._vertices.length; j++) {
                this.matrix[i][j] = false;
                this.matrix[j][i] = false;
            }
        }
        this.pathEnd = [null, null];
    }
    private connected(i: number, j: number) {
        return this.matrix[i][j];
    }
    public connect(i: number, j: number) {
        if (this.connected(i, j))
            return false;
        this.adjacent[i].push(j);
        this.adjacent[j].push(i);
        this.matrix[i][j] = true;
        this.matrix[j][i] = true;
        return true;
    }
    public unconnect(i: number, j: number) {
        if (!this.connected(i, j))
            return false;
        remove(this.adjacent[i], j);
        remove(this.adjacent[j], i);
        this.matrix[i][j] = false;
        this.matrix[j][i] = false;
        return true;
    }
    public removeAdjacent(i: number) {
        this.adjacent[i] = [];
        for (let j = 0; j < this._vertices.length; j++)
            this.matrix[i][j] = false;
    }
    public randomGenerate(generateCount: number) {
        this._vertices = [];
        this.adjacent = [];
        this.matrix = [];
        this.pathEnd = [null, null];
        // 隨機生成 Vertices
        for (let i = 0; i < generateCount; i++) {
            this._vertices.push(
                Vec.add(this.center, new Vec(
                    Math.random() * this.expectedSize - this.expectedSize / 2,
                    Math.random() * this.expectedSize - this.expectedSize / 2
                )));
            this.adjacent.push([]);
            this.matrix.push([]);
            for (let j = 0; j < generateCount; j++)
                this.matrix[i].push(false);
        }
    }
    public randomConnect(maxNewConnect: number, maxAdjacentCount: number, maxDistance: number) {
        // 隨機連接 Vertices
        while (maxNewConnect > 0) {
            const i = randomInt(0, this._vertices.length - 1);
            const j = randomInt(0, this._vertices.length - 1);
            if (this.adjacent[i].length < maxAdjacentCount && this.adjacent[j].length < maxAdjacentCount &&
                Vec.distance(this._vertices[i], this._vertices[j]) < maxDistance)
                this.connect(i, j);
            maxNewConnect--;
        }
    }
    private static move(vertex: Vec, targetPos: Vec, moveSpeed: number) {
        const dir = Vec.sub(vertex, targetPos).normalized();
        vertex.add(Vec.mult(dir, moveSpeed));
    }
    public iterate(moveSpeed: number) {
        /* reference: https://youtu.be/TXi5gA-pSkY?si=ylsXEAxPUTZ-IeKY */
        for (let i = 0; i < this._vertices.length; i++) {
            const vi = this._vertices[i];
            // vi move to center
            ForceGraph.move(vi, this.center, -moveSpeed * clamp((vi.mag() / (this.expectedSize / 2)), 0, 1));
            for (let j = 0; j < this._vertices.length; j++) {
                const vj = this._vertices[j];
                if (i == j)
                    continue;
                const dist = Vec.distance(vi, vj) / (this.expectedSize / 2);
                if (this.connected(i, j))
                    // vi be pulled by vj if connected
                    ForceGraph.move(vi, vj, -moveSpeed * clamp(dist, 0, 1));
                // vi be pushed by vj
                ForceGraph.move(vi, vj, moveSpeed * (1 - clamp(dist, 0, 1)));
            }
        }
    }
    public render(ctx: CanvasRenderingContext2D | null, vertexRadius: number, vertexColor: string, edgeWidth: number, edgeColor: string) {
        if (!ctx) return;

        ctx.setLineDash([5, 5]);

        // draw egdes
        ctx.lineWidth = edgeWidth;
        ctx.strokeStyle = edgeColor;
        ctx.beginPath();
        for (let i = 0; i < this._vertices.length - 1; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j)) {
                    ctx.moveTo(this._vertices[i].x, this._vertices[i].y);
                    ctx.lineTo(this._vertices[j].x, this._vertices[j].y);
                }
        ctx.stroke();

        // draw vertices
        ctx.fillStyle = vertexColor;
        ctx.beginPath();
        for (const v of this._vertices) {
            ctx.arc(v.x, v.y, vertexRadius, 0, 2 * Math.PI);
            ctx.closePath();
        }
        ctx.fill();

        if (this.pathEnd[0] && this.pathEnd[1]) {
            drawCircle(ctx, this._vertices[this.pathEnd[0]], vertexRadius, "red");
            drawCircle(ctx, this._vertices[this.pathEnd[1]], vertexRadius, "red");
        }
    }
    private findMST() { // Kruskal's algorithm
        //            weight  vertex  vertex
        const edges: [number, number, number][] = [];
        for (let i = 0; i < this._vertices.length; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j))
                    edges.push([Vec.distance(this._vertices[i], this._vertices[j]), i, j]);
        if (edges.length < this._vertices.length - 1) {
            console.error("Not Enough edges in", edges);
            return [];
        }

        // sort by weight(distance) increasingly
        edges.sort((e1, e2) => {
            if (e1[0] > e2[0])
                return 1;
            if (e1[0] < e2[0])
                return -1;
            return 0;
        });

        // build MST
        const mst: [number, number][] = [];
        const dsu = new DSU(edges.length);
        for (let i = 0; i < edges.length; i++) {
            let a = dsu.Find(edges[i][1]);
            let b = dsu.Find(edges[i][2]);
            if (a != b) // if a & b are not the same set
            {
                dsu.Union(a, b);
                mst.push([edges[i][1], edges[i][2]]);
            }
        }
        return mst;
    }
    private findPath(adjacency: number[][], start: number, end: number) { // dijkstra
        const dist: number[] = [];
        const visited: boolean[] = [];
        const prev: (number | null)[] = [];
        // min heap
        const heap = new Heap((a: { id: number, dist: number }, b: { id: number, dist: number }) => a.dist < b.dist);

        for (let i = 0; i < this._vertices.length; i++) {
            visited.push(false);
            prev.push(null);
            dist.push(Infinity);
        }
        dist[start] = 0;
        heap.push({ id: start, dist: 0 });

        while (!heap.empty()) {
            let cur: number = heap.pop().id;

            if (cur === end) // done
                break;

            if (visited[cur] || dist[cur] === Infinity)
                continue;
            visited[cur] = true;

            for (const v of adjacency[cur]) {
                if (visited[v]) continue;
                const weight = Vec.distance(this._vertices[cur], this._vertices[v]);
                if (dist[cur] + weight < dist[v]) {
                    dist[v] = dist[cur] + weight;
                    prev[v] = cur;
                    heap.push({id: v, dist: weight});
                }
            }
        }

        // build up path
        const path: number[] = [end];
        while (prev[end] !== null) {
            end = Number(prev[end]);
            path.push(end);
        }
        // return path.reverse();
        return path;
    }
    private findPaths(pathCount: number) {
        // find the lowest & highest point as start & end
        let start = 0, end = 0;
        const rightTop = Vec.add(this.center, new Vec(this.expectedSize/2, -this.expectedSize/2));
        const leftBottom = Vec.add(this.center, new Vec(-this.expectedSize/2, this.expectedSize/2));
        for (let i = 0; i < this._vertices.length; i++) {
            if (Vec.distance(rightTop, this._vertices[i]) < Vec.distance(rightTop, this._vertices[start]))
                start = i;
            if (i == start) continue;
            if (Vec.distance(leftBottom, this._vertices[i]) < Vec.distance(leftBottom, this._vertices[end]))
                end = i;
        }
        if (start == end) {
            console.error("Start & End are same: ", start, " in ", this._vertices);
            return [];
        }

        const paths: number[][] = []
        while (pathCount > 0) {
            const newPath = this.findPath(this.adjacent, start, end);
            paths.push(newPath);
            pathCount--;
            if (pathCount <= 0)
                break;
            // randomly remove some edges of newPath from graph
            let removeCount = randomInt(newPath.length / 3, newPath.length * 2 / 3);
            while (removeCount-- > 0) {
                const vertexToRemove = newPath[randomInt(1, newPath.length - 2)];
                this.removeAdjacent(vertexToRemove);
            }
        }

        this.pathEnd = [start, end];
        return paths;
    }
    public buildMST() {
        const mst = this.findMST();
        // rebuild edges
        this.clearEdges();
        for (const edge of mst)
            this.connect(edge[0], edge[1]);
    }
    public buildPaths(pathCount: number) {
        const paths = this.findPaths(pathCount);
        const oldPathEnd = this.pathEnd;

        // rebuild edges
        this.clearEdges();

        for (const path of paths)
            for (let i = 1; i < path.length; i++)
                this.connect(path[i-1], path[i]);

        this.pathEnd = oldPathEnd;
    }
    public buildMSTPaths(pathCount: number) {
        const mst = this.findMST();
        const paths = this.findPaths(pathCount);
        const oldPathEnd = this.pathEnd;

        // rebuild edges
        this.clearEdges();

        for (const edge of mst)
            this.connect(edge[0], edge[1]);

        for (const path of paths)
            for (let i = 1; i < path.length; i++)
                this.connect(path[i-1], path[i]);

        this.pathEnd = oldPathEnd;
    }
}
