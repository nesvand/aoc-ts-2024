# Combined Data Structure Examples

Here are examples of how multiple data structures can work together to solve more complex problems:

## 1. Advanced Task Scheduler

Combines Binary Heap and Ring Buffer to manage tasks with history:

```typescript
class AdvancedTaskScheduler {
    private taskQueue: BinaryHeap<Task>;
    private taskHistory: RingBuffer<Task>;
    
    constructor(historySize: number) {
        this.taskQueue = new BinaryHeap<Task>((a, b) => a.priority - b.priority);
        this.taskHistory = new RingBuffer<Task>(historySize);
    }

    public scheduleTask(name: string, priority: number): void {
        const task = new Task(name, priority, new Date());
        this.taskQueue.push(task);
    }

    public executeNextTask(): Task | undefined {
        const task = this.taskQueue.pop();
        if (task) {
            this.taskHistory.push(task); // Keep history of executed tasks
        }
        return task;
    }

    public getRecentTasks(): Task[] {
        return this.taskHistory.toArray();
    }
}

// Usage:
const scheduler = new AdvancedTaskScheduler(5);
scheduler.scheduleTask("Critical Update", 1);
scheduler.scheduleTask("Regular Maintenance", 3);
scheduler.executeNextTask(); // Executes Critical Update
```

## 2. Network Route Analyzer

Combines Trie and Disjoint Set to analyze network paths and connectivity:

```typescript
class NetworkRouteAnalyzer {
    private routes: Trie;
    private connections: DisjointSet;
    private nodeMap: Map<string, number>;
    private nodeCount: number;

    constructor() {
        this.routes = new Trie();
        this.nodeMap = new Map();
        this.nodeCount = 0;
        this.connections = new DisjointSet(0);
    }

    private getNodeId(node: string): number {
        if (!this.nodeMap.has(node)) {
            this.nodeMap.set(node, this.nodeCount++);
            // Recreate DisjointSet with new size
            const newConnections = new DisjointSet(this.nodeCount);
            // Copy existing connections
            for (const [node1, id1] of this.nodeMap) {
                for (const [node2, id2] of this.nodeMap) {
                    if (this.connections.connected(id1, id2)) {
                        newConnections.union(id1, id2);
                    }
                }
            }
            this.connections = newConnections;
        }
        return this.nodeMap.get(node)!;
    }

    public addRoute(path: string): void {
        this.routes.insert(path);
        // Extract nodes from path and connect them
        const nodes = path.split('/').filter(n => n);
        for (let i = 0; i < nodes.length - 1; i++) {
            const id1 = this.getNodeId(nodes[i]);
            const id2 = this.getNodeId(nodes[i + 1]);
            this.connections.union(id1, id2);
        }
    }

    public findMatchingRoutes(prefix: string): string[] {
        return this.routes.findAllWithPrefix(prefix);
    }

    public areNodesConnected(node1: string, node2: string): boolean {
        const id1 = this.getNodeId(node1);
        const id2 = this.getNodeId(node2);
        return this.connections.connected(id1, id2);
    }
}

// Usage:
const network = new NetworkRouteAnalyzer();
network.addRoute("/api/users/profile");
network.addRoute("/api/users/settings");
network.addRoute("/api/products");
console.log(network.findMatchingRoutes("/api/")); // All routes
console.log(network.areNodesConnected("users", "profile")); // true
console.log(network.areNodesConnected("users", "products")); // false
```

## 3. Game Leaderboard System

Combines Segment Tree and Binary Heap for efficient score tracking:

```typescript
class LeaderboardSystem {
    private scoreHistory: SegmentTree;
    private currentRanking: BinaryHeap<Player>;
    private playerScores: Map<string, number>;

    constructor(playerCount: number) {
        this.scoreHistory = new SegmentTree(
            new Array(playerCount).fill(0),
            (a, b) => a + b,
            0
        );
        this.currentRanking = new BinaryHeap<Player>((a, b) => b.score - a.score);
        this.playerScores = new Map();
    }

    public updateScore(playerId: string, score: number, position: number): void {
        // Update historical scores
        this.scoreHistory.update(position, score);
        
        // Update current ranking
        const player = { id: playerId, score };
        this.currentRanking.push(player);
        this.playerScores.set(playerId, score);
    }

    public getTopPlayers(count: number): Player[] {
        const result: Player[] = [];
        const tempHeap = new BinaryHeap<Player>((a, b) => b.score - a.score);
        
        // Copy current ranking
        this.currentRanking.toArray().forEach(player => tempHeap.push(player));
        
        // Get top players
        for (let i = 0; i < count && !tempHeap.isEmpty(); i++) {
            const player = tempHeap.pop();
            if (player) result.push(player);
        }
        
        return result;
    }

    public getAverageScore(start: number, end: number): number {
        const sum = this.scoreHistory.queryRange(start, end);
        return sum / (end - start + 1);
    }
}

// Usage:
const leaderboard = new LeaderboardSystem(100);
leaderboard.updateScore("player1", 1000, 0);
leaderboard.updateScore("player2", 850, 1);
leaderboard.updateScore("player3", 920, 2);
console.log(leaderboard.getTopPlayers(2)); // Top 2 players
console.log(leaderboard.getAverageScore(0, 2)); // Average score
```

Key Benefits of Combining Data Structures:
1. Solve more complex problems
2. Maintain multiple views of the same data
3. Balance between different performance characteristics
4. Handle both real-time and historical data
5. Create more flexible and powerful systems

Common Combined Use Cases:
- Advanced scheduling systems
- Network analysis tools
- Game systems
- Data analytics platforms
- Caching systems with history
- Search engines with ranking
- Monitoring and logging systems 