# Rougelike Map Generator

This is a graph-like rougelike map generator.

[Play the generator here](https://c-w-z.github.io/rougelike-map-generator/)

## Used Algorithms

- Force-directed Graph Drawing
- Bowyer-Watson Algorithm
- Kruskal's Algorithm (with DSU)
- Dijkstra's Algorithm (with Heap)
- Roulette Wheel Selection
- ......

## Functions (Buttons)

I have make some functions (as buttons in the website) to help generating maps, you can use different combination of these functions to make your map.
```
Generate()
Generate some vertices at random positions
```
```
Start Iteration(Vertex Force, Max Iteration)
Use Force-directed Graph to distribute them more evenly
```
```
Delaunay Triangulate()
Use Bowyer-Watson Algorithm to do Delaunay Triangulation
```
```
Build MST()
Use Kruskal's Algorith to build Minimum Spaning Tree after delaunate()
```
```
Build Paths(Path Count)
must used after delaunate()
1. Use Dijkstra's Algorithm to find a path from start to end
2. Randomly delete some vertices of the path from graph
3. Repeat 1 & 2 several times, and finally merge all paths
```
```
Build MST & Paths(Path Count)
must used after delaunate()
Use buildMST() & buildPaths() to find the MST & paths, and finally merge them.
```
```
Delete Edges(Delete Count)
Randomly delete some edges if some vertices have too many edges.
```
```
Decide Room Type()
1. Use Roulette Wheel Selection to randomly decide room type of all vertices
2. Fix if elite enemy appear near to start point
3. Fix if two rare rooms are adjacent
4. Fix if there are too many or too few of each types of room
5. Place the leaf vertices as rare types of room
6. Randomly Place the vertices in front of leaves as elite enemy
```

The last button `New Map()` will do my favorite combination instantly:
```
1. Generate()
2. Start Iteration()
3. Delaunay Triangulate()
4. repeat 3 & 4
5. Build MST & Paths()
6. repeat 4 & 5
7. Delete Edges()
8. Decide Room Type()
```

Another way to generate awesome map without leaf vertices is:

after delaunate(), just use randomDeleteEdge() several times and then decideRoomTypes()

## Reference

Another map generator: [The map generator inspired by Slay the Spire](https://github.com/yurkth/stsmapgen)

Force-directed Graph Drawing: [Unity Procedural Terrain 8 - Intro to Force Graph](https://youtu.be/TXi5gA-pSkY?si=ylsXEAxPUTZ-IeKY)

Bowyer-Waston Algorithm: [非關語言：玩轉 p5.js](https://openhome.cc/Gossip/P5JS/Delaunay.html) & [技术分享：Delaunay三角剖分算法介绍](https://zhuanlan.zhihu.com/p/459884570)

Heap: [Efficient way to implement Priority Queue in Javascript?](https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript)

## Images

[Location icons created by IconMarketPK - Flaticon](https://www.flaticon.com/free-icon/location-pin_2776000)

[Flag icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icon/finish_2164609)

[Skull icons created by Andy Horvath - Flaticon](https://www.flaticon.com/free-icon/skull_5875938)

[Devil icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icon/skull_5768016)

[Smart key icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/key_93128)

[Money icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/money_61584)

[Bonfire icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/bonfire_2163004)

[Question mark icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/question-mark_3524344)

[Rune icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/rune_336131)

[Wrong icons created by Mihimihi - Flaticon](https://www.flaticon.com/free-icon/cross_7699001)

[North icons created by Freepik - Flaticon](https://www.flaticon.com/free-icon/compass-symbol_80036)
