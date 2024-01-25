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
        while ((Heap.left(node) < this.size() && this.greater(Heap.left(node), node)) ||
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
    private pathEnd: [number | null, number | null];
    private cPath: number[];
    constructor(center: Vec, expectedSize: number) {
        this.center = center;
        this.expectedSize = expectedSize;
        this._vertices = [];
        this.adjacent = [];
        this.matrix = [];
        this.pathEnd = [null, null];
        this.cPath = [];
    }
    public get vertices() {
        return this._vertices;
    }
    public get start() {
        return this.pathEnd[0];
    }
    public get end() {
        return this.pathEnd[1];
    }
    public get criticalPath() {
        return this.cPath;
    }
    public adjacents(v: number) {
        return this.adjacent[v];
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
        this.cPath = [];
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
                Vec.dist(this._vertices[i], this._vertices[j]) < maxDistance)
                this.connect(i, j);
            maxNewConnect--;
        }
    }
    private static move(vertex: Vec, targetPos: Vec, moveSpeed: number) {
        const dir = Vec.sub(vertex, targetPos).normalized();
        vertex.add(Vec.mult(dir, moveSpeed));
    }
    private iterateStep(moveSpeed: number) {
        /* reference: https://youtu.be/TXi5gA-pSkY?si=ylsXEAxPUTZ-IeKY */
        for (let i = 0; i < this._vertices.length; i++) {
            const vi = this._vertices[i];
            // vi move to center
            ForceGraph.move(vi, this.center, -moveSpeed * clamp((vi.mag() / (this.expectedSize / 2)), 0, 1));
            for (let j = 0; j < this._vertices.length; j++) {
                const vj = this._vertices[j];
                if (i == j)
                    continue;
                const dist = Vec.dist(vi, vj) / (this.expectedSize / 2);
                if (this.connected(i, j))
                    // vi be pulled by vj if connected
                    ForceGraph.move(vi, vj, -moveSpeed * clamp(dist, 0, 1));
                // vi be pushed by vj
                ForceGraph.move(vi, vj, moveSpeed * (1 - clamp(dist, 0, 1)));
            }
        }
    }
    public iterate(moveSpeed: number, iterateTime: number = 1) {
        for (let i = 0; i < iterateTime; i++)
            this.iterateStep(moveSpeed);
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
    }
    private findMST() { // Kruskal's algorithm
        //            weight  vertex  vertex
        const edges: [number, number, number][] = [];
        for (let i = 0; i < this._vertices.length; i++)
            for (let j = i + 1; j < this._vertices.length; j++)
                if (this.connected(i, j))
                    edges.push([Vec.sqrDist(this._vertices[i], this._vertices[j]), i, j]);
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
                const weight = Vec.sqrDist(this._vertices[cur], this._vertices[v]);
                if (dist[cur] + weight < dist[v]) {
                    dist[v] = dist[cur] + weight;
                    prev[v] = cur;
                    heap.push({ id: v, dist: dist[v] });
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
        const [start, end] = this.findPathEnd();
        this.pathEnd = [start, end];
        if (start == end || start === null || end === null) {
            console.error("Start / End error: ", this.pathEnd);
            return [];
        }

        this.cPath = [];
        const paths: number[][] = []
        while (pathCount > 0) {
            const newPath = this.findPath(this.adjacent, start, end);
            paths.push(newPath);
            if (this.cPath.length == 0)
                this.cPath = newPath;
            pathCount--;
            if (pathCount <= 0)
                break;
            // randomly remove some edges of newPath from graph
            let removeCount = randomInt(1, 3) + clamp(Math.floor(pathCount / 2), 0, 2);
            while (removeCount-- > 0) {
                const vertexToRemove = newPath[randomInt(1, newPath.length - 2)];
                this.removeAdjacent(vertexToRemove);
            }
        }

        return paths;
    }
    public delaunate() {
        // delaunay triangulation
        const d = new Delaunator(CANVAS_CENTER, CANVAS_SIZE, CANVAS_SIZE);
        for (const v of g.vertices)
            d.addPoint(v);
        // build egdes from delaunay
        g.clearEdges();
        d.indicesOfTriangles.forEach(tri => {
            g.connect(tri[0], tri[1]);
            g.connect(tri[1], tri[2]);
            g.connect(tri[2], tri[0]);
        });
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
                this.connect(path[i - 1], path[i]);

        this.pathEnd = oldPathEnd;
    }
    public buildMSTPaths(pathCount: number) {
        const mst = this.findMST();
        const paths = this.findPaths(pathCount);
        const [start, end] = this.pathEnd;

        if (start === null || end === null) {
            console.error("Not found start / end points");
            return;
        }

        // rebuild edges
        this.clearEdges();

        for (const edge of mst)
            this.connect(edge[0], edge[1]);

        for (const path of paths)
            for (let i = 1; i < path.length; i++)
                this.connect(path[i - 1], path[i]);

        this.pathEnd = [start, end];
    }
    private findPathEnd() {
        // find the lowest & highest point as start & end
        let start = 0, end = 0;
        const rightTop = Vec.add(this.center, new Vec(this.expectedSize, -this.expectedSize));
        const leftBottom = Vec.add(this.center, new Vec(-this.expectedSize, this.expectedSize));
        for (let i = 0; i < this._vertices.length; i++) {
            if (Vec.sqrDist(leftBottom, this._vertices[i]) < Vec.sqrDist(leftBottom, this._vertices[start]))
                start = i;
            if (i == start) continue;
            if (Vec.sqrDist(rightTop, this._vertices[i]) < Vec.sqrDist(rightTop, this._vertices[end]))
                end = i;
        }
        if (start == end || start === null || end === null)
            console.error("find start / end error: ", [start, end]);
        return [start, end];
    }
    private findDistant(adjacency: number[][], start: number) {
        const n = this._vertices.length;
        const dist: number[] = [];
        const visited: boolean[] = [];
        const heap = new Heap((a: { id: number, dist: number }, b: { id: number, dist: number }) => a.dist < b.dist);
        for (let i = 0; i < n; i++) {
            visited.push(false);
            dist.push(Infinity);
        }
        dist[start] = 0;
        heap.push({ id: start, dist: 0 });

        while (!heap.empty()) {
            let cur: number = heap.pop().id;

            if (visited[cur] || dist[cur] === Infinity)
                continue;
            visited[cur] = true;

            for (const v of adjacency[cur]) {
                if (visited[v]) continue;
                if (dist[cur] + 1 < dist[v]) {
                    dist[v] = dist[cur] + 1;
                    heap.push({ id: v, dist: dist[v] });
                }
            }
        }

        console.log(dist);
        let maxDist = dist[0];
        let res = 0;
        for (let i = 1; i < n; i++)
            if (dist[i] > maxDist) {
                maxDist = dist[i];
                res = i;
            }
        return res;
    }
    public fixPathEnd() {
        // fix if no start / end vertex
        if (this.pathEnd[0] === null || this.pathEnd[1] === null) {
            const [start, end] = this.findPathEnd();
            this.pathEnd = [start, end];
        }

        if (this._vertices.length < 8 || this.adjacent[Number(this.start)].includes(Number(this.end)))
        {
            this.pathEnd[1] = this.findDistant(this.adjacent, Number(this.start));
            return;
        }

        // fix if start / end vertex has adjacent leaf vertices
        for (let i = 0; i < 2; i++)
            for (const v of this.adjacent[Number(this.pathEnd[i])])
                if (this.adjacent[v].length == 1) {
                    this.pathEnd[i] = v;
                    break;
                }
    }
    public randomDeleteEdge(repeat: number) {
        const canDeleteEdgeOn = (v: number) =>
            v != this.pathEnd[0] && v != this.pathEnd[1] && this.adjacent[v].length > 3;

        const candidate: number[] = [];
        for (let i = 0; i < this._vertices.length; i++)
            if (canDeleteEdgeOn(i))
                candidate.push(i);

        if (candidate.length == 0)
            return;

        let count = 0;
        while (repeat-- > 0) {
            const v = candidate[randomInt(0, candidate.length - 1)];
            if (this.adjacent[v].length == 0)
                continue;
            const u = this.adjacent[v][randomInt(0, this.adjacent[v].length - 1)];
            if (canDeleteEdgeOn(v) && canDeleteEdgeOn(u)) {
                this.unconnect(v, u);
                count++;
            }
        }

        // console.log("delete " + count);
    }
    public calculateFitness() {
        let count1 = 0;
        let count2 = 0;
        let badCount = 0;
        let maxBadLen = 0;
        for (let i = 0; i < this._vertices.length; i++) {
            if (this.adjacent[i].length == 2)
                count2++;
            else if (this.adjacent[i].length == 1) {
                count1++;
                let prev = i;
                let next = this.adjacent[i][0];
                if (this.adjacent[next].length == 2)
                    badCount++;
                let len = 1;
                while (this.adjacent[next].length == 2) {
                    len++;
                    if (this.adjacent[next][0] == prev) {
                        prev = next;
                        next = this.adjacent[next][1];
                    } else {
                        prev = next;
                        next = this.adjacent[next][0];
                    }
                }
                maxBadLen = Math.max(maxBadLen, len);
            }
        }
        const score = -count1 * 5 - count2 - badCount * 5 - maxBadLen * 10;
        console.log("count: ", count1, count2, badCount, maxBadLen, "score: ", score);
        return [count1, count2, badCount, maxBadLen];
    }
}

const RoomType = {
    star: 0, // start room
    norm: 1, // normal enemy
    elit: 2, // elite enemy (hard)
    tres: 3, // treasure
    shop: 4, // merchant
    rest: 5, // rest room
    unkn: 6, // unknown (can be event/norm/rare/shop/rest)
    esoc: 7, // esoteric
    boss: 8, // boss room
}
const RoomFreq = [ // the weight of room to appear
    0, // start room
    9, // normal enemy
    4, // elite enemy (hard)
    2, // treasure
    1, // merchant
    1, // rest room
    2, // unknown (can be event/norm/rare/shop/rest)
    1, // esoteric
    0, // boss room
];
const RareRoomType = [RoomType.tres, RoomType.shop, RoomType.unkn, RoomType.esoc];
const RareRoomFreq = RareRoomType.map(id => RoomFreq[id]);

class RandomMap {
    private type: number[];
    private static numArr: number[] = [];
    constructor() {
        this.type = [];
        RandomMap.numArr = new Array(RoomFreq.length);
        for (let i = 0; i < RandomMap.numArr.length; i++)
            RandomMap.numArr[i] = i;
    }
    public get roomType() {
        return this.type;
    }
    public clear() {
        this.type = [];
    }
    public generate(g: ForceGraph, vertexCount: number, vertexForce: number, iteration: number, pathCount: number, deleteCount: number) {
        g.randomGenerate(vertexCount);
        g.iterate(vertexForce, iteration);
        g.delaunate();
        g.iterate(vertexForce, iteration);
        g.delaunate();
        g.buildMSTPaths(pathCount);
        g.iterate(vertexForce, iteration);
        g.delaunate();
        g.buildMSTPaths(pathCount);
        g.randomDeleteEdge(deleteCount);
        g.fixPathEnd();
        // g.calculateFitness();
    }
    private rollAllType() {
        return roll(RandomMap.numArr, RoomFreq)
    }
    private rollRareType() {
        return roll(RareRoomType, RareRoomFreq);
    }
    public decideRoomTypes(g: ForceGraph) {
        const n = g.vertices.length;

        this.type = [];
        for (let i = 0; i < n; i++)
            this.type.push(-1);

        /* random decide types */
        for (let i = 0; i < n; i++)
            if (g.adjacents(i).length > 0)
                this.type[i] = this.rollAllType();

        if (g.start === null || g.end === null || g.adjacents(g.start).includes(g.end)) {
            g.fixPathEnd();
            if (g.start === null || g.end === null) {
                console.error("Not found start / end of ", g);
                return;
            }
        }

        // elite & rest should not appear near start point
        for (const v of g.adjacents(g.start)) {
            if (this.type[v] === RoomType.elit)
                this.type[v] = RoomType.norm;
            if (this.type[v] === RoomType.rest)
                this.type[v] = this.rollRareType();
        }

        // decrease the possibility that two rare rooms appear nearly
        const fixNearSameType = (vToChange: number, type: number) => {
            if (this.type[vToChange] != type)
                return;
            const adj = g.adjacents(vToChange);
            for (const u of adj) {
                if (this.type[u] != type)
                    continue;
                this.type[vToChange] = this.rollRareType();
            }
        }

        // fix nearly same types
        for (let i = 0; i < n; i++) {
            if (g.adjacents(i).length < 0) continue;
            fixNearSameType(i, RoomType.tres);
            fixNearSameType(i, RoomType.esoc);
            fixNearSameType(i, RoomType.rest);
            fixNearSameType(i, RoomType.shop);
            if (this.type[i] != RoomType.elit) {
                const adj = g.adjacents(i);
                for (const u of adj)
                    if (this.type[u] == RoomType.elit)
                        this.type[i] = RoomType.norm;
            }
        }

        // calculate rooms
        const rooms: number[][] = [];
        for (let i = 0; i < RoomFreq.length; i++)
            rooms.push([]);
        for (let i = 0; i < n; i++)
            if (i != g.start && i != g.end && g.adjacents(i).length > 0)
                rooms[this.type[i]].push(i);

        const fixCount = (type: number, anotherType: number, least: number, most: number = n) => {
            let maxCheck = Math.abs(least - rooms[type].length) * 2;
            while (rooms[type].length < least && maxCheck > 0) {
                maxCheck--;
                if (rooms[anotherType].length == 0) {
                    console.error("Not enough anotherType:", anotherType);
                    return;
                }
                const id = randomInt(0, rooms[anotherType].length - 1);
                const v = rooms[anotherType][id];
                // elite & rest should not appear near start point
                if ((type == RoomType.elit || type == RoomType.rest) && g.adjacents(v).includes(Number(g.start)))
                    continue;
                // change v from anotherType to type
                rooms[type].push(v);
                rooms[anotherType].splice(id, 1);
                this.type[v] = type;
            }
            maxCheck = Math.abs(rooms[type].length - most) * 2;
            while (rooms[type].length > most && maxCheck > 0) {
                maxCheck--;
                const id = randomInt(0, rooms[type].length - 1);
                const v = rooms[type][id];
                // elite & rest should not appear near start point
                if ((type == RoomType.elit || type == RoomType.rest) && g.adjacents(v).includes(Number(g.start)))
                    continue;
                // change v from type to anotherType
                rooms[anotherType].push(v);
                rooms[type].splice(id, 1);
                this.type[v] = anotherType;
            }
        }

        // fix if there are too few / much some types of rooms
        fixCount(RoomType.elit, RoomType.norm, Math.floor(n * 0.1), Math.floor(n * 0.2));
        fixCount(RoomType.tres, RoomType.norm, Math.floor(n * 0.1), Math.floor(n * 0.2));
        fixCount(RoomType.unkn, RoomType.norm, Math.floor(n * 0.1), Math.floor(n * 0.2));
        fixCount(RoomType.shop, RoomType.norm, Math.max(1, Math.floor(n * 0.05)), Math.floor(n * 0.2));
        fixCount(RoomType.rest, RoomType.norm, 1, Math.floor(n * 0.1));
        fixCount(RoomType.esoc, RoomType.elit, 0, Math.floor(n * 0.12));
        fixCount(RoomType.norm, RoomType.elit, Math.floor(n * 0.3));

        // fix leaf vertices
        for (let i = 0; i < n; i++) {
            if (g.adjacents(i).length != 1) continue;
            // place rare rooms at leaf vertices
            if (this.type[i] == RoomType.norm || this.type[i] == RoomType.elit) {
                remove(rooms[this.type[i]], i);
                this.type[i] = this.rollRareType();
                rooms[this.type[i]].push(i);
            }
            // fix nearly same rare rooms at leaf vertices
            const v = g.adjacents(i)[0];
            if (this.type[v] == this.type[i] && RareRoomType.includes(this.type[i])) {
                // console.log("rare to elite");
                remove(rooms[this.type[v]], v);
                this.type[v] = RoomType.elit;
                rooms[this.type[v]].push(v);
            }
        }

        fixCount(RoomType.elit, RoomType.norm, Math.floor(n * 0.1), Math.floor(n * 0.2));

        // finally assign start/end type
        this.type[g.start] = RoomType.star;
        this.type[g.end] = RoomType.boss;
        // rooms[RoomType.star].push(g.start);
        // rooms[RoomType.boss].push(g.end);

        console.log("norm:", rooms[RoomType.norm].length,
            "elit:", rooms[RoomType.elit].length,
            "tres:", rooms[RoomType.tres].length,
            "shop:", rooms[RoomType.shop].length,
            "rest:", rooms[RoomType.rest].length,
            "unkn:", rooms[RoomType.unkn].length,
            "esoc:", rooms[RoomType.esoc].length);
    }
    public render(ctx: CanvasRenderingContext2D | null, vertices: Vec[], img: HTMLImageElement[]) {
        if (!ctx) return;
        if (vertices.length != this.type.length) {
            console.error("Map Render Error");
            return;
        }

        for (let i = 0; i < vertices.length; i++) {
            if (this.type[i] < 0) continue;
            const icon = img[this.type[i]];
            const pos = vertices[i];
            if (this.type[i] == RoomType.boss)
                // bigger icon for boss
                ctx.drawImage(icon, pos.x - 16, pos.y - 16, 32, 32);
            else
                ctx.drawImage(icon, pos.x - 8, pos.y - 8, 16, 16);
        }
    }
}
