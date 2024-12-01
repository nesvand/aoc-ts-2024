# Disjoint Set (Union-Find) Examples

The Disjoint Set data structure is particularly useful for tracking groups of connected elements. Here are some practical examples of its applications:

## 1. Network Connectivity

Track which computers can communicate with each other in a network:

```typescript
class NetworkConnectivity {
    private network: DisjointSet;
    private computerCount: number;

    constructor(computerCount: number) {
        this.computerCount = computerCount;
        this.network = new DisjointSet(computerCount);
    }

    public connect(computer1: number, computer2: number): void {
        this.network.union(computer1, computer2);
    }

    public canCommunicate(computer1: number, computer2: number): boolean {
        return this.network.connected(computer1, computer2);
    }

    public getNetworkMembers(computer: number): number[] {
        return this.network.getSet(computer);
    }

    public getNetworkCount(): number {
        return this.network.sets;
    }
}

// Usage:
const network = new NetworkConnectivity(6);
network.connect(0, 1);  // Connect computers 0 and 1
network.connect(1, 2);  // Connect computers 1 and 2
console.log(network.canCommunicate(0, 2));  // true: 0-1-2 are connected
console.log(network.getNetworkMembers(0));  // [0, 1, 2]
console.log(network.getNetworkCount());     // 3 networks: [0,1,2], [3,4], [5]
```

## 2. Social Networks

Track friend circles and connections:

```typescript
class SocialNetwork {
    private connections: DisjointSet;
    private userCount: number;

    constructor(userCount: number) {
        this.userCount = userCount;
        this.connections = new DisjointSet(userCount);
    }

    public addFriendship(user1: number, user2: number): void {
        this.connections.union(user1, user2);
    }

    public areConnected(user1: number, user2: number): boolean {
        return this.connections.connected(user1, user2);
    }

    public getFriendCircle(user: number): number[] {
        return this.connections.getSet(user);
    }

    public getDistinctCircles(): number {
        return this.connections.sets;
    }
}
```

## 3. Grid/Maze Problems

Solve connectivity problems in 2D grids:

```typescript
class MazeSolver {
    private grid: DisjointSet;
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new DisjointSet(width * height);
    }

    private getCellIndex(row: number, col: number): number {
        return row * this.width + col;
    }

    public connectCells(row1: number, col1: number, row2: number, col2: number): void {
        const cell1 = this.getCellIndex(row1, col1);
        const cell2 = this.getCellIndex(row2, col2);
        this.grid.union(cell1, cell2);
    }

    public hasPath(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        const start = this.getCellIndex(startRow, startCol);
        const end = this.getCellIndex(endRow, endCol);
        return this.grid.connected(start, end);
    }
}
```

## 4. Game Development

Manage team alliances in a multiplayer game:

```typescript
class TeamManager {
    private teams: DisjointSet;
    private playerCount: number;

    constructor(playerCount: number) {
        this.playerCount = playerCount;
        this.teams = new DisjointSet(playerCount);
    }

    public formAlliance(player1: number, player2: number): void {
        this.teams.union(player1, player2);
    }

    public areAllies(player1: number, player2: number): boolean {
        return this.teams.connected(player1, player2);
    }

    public getTeamMembers(player: number): number[] {
        return this.teams.getSet(player);
    }
}
```

## 5. Image Processing

Find connected components in binary images:

```typescript
class ImageComponentLabeler {
    private pixels: DisjointSet;
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new DisjointSet(width * height);
    }

    private getPixelIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    public connectPixels(x1: number, y1: number, x2: number, y2: number): void {
        const pixel1 = this.getPixelIndex(x1, y1);
        const pixel2 = this.getPixelIndex(x2, y2);
        this.pixels.union(pixel1, pixel2);
    }

    public getComponent(x: number, y: number): number[] {
        const pixel = this.getPixelIndex(x, y);
        return this.pixels.getSet(pixel);
    }

    public getComponentCount(): number {
        return this.pixels.sets;
    }
}
```

Key Benefits:
1. Efficiency: Near-constant time operations with path compression and union by rank
2. Simplicity: Easy to implement and understand
3. Versatility: Can be applied to many different problems
4. Memory Efficient: Uses minimal extra space
5. Dynamic: Supports online updates and queries

Common Use Cases:
- Finding connected components in graphs
- Detecting cycles in graphs
- Minimum spanning tree algorithms
- Network connectivity problems
- Dynamic connectivity
- Image processing
- Game mechanics
- Social network analysis 