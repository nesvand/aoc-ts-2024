# Binary Heap Examples

A Binary Heap is useful for maintaining a priority queue where you need quick access to the highest (or lowest) priority element. Here are some practical examples:

## 1. Task Scheduler

Manage tasks with different priority levels:

```typescript
class Task implements PositionTrackable {
    constructor(
        public name: string,
        public priority: number,
        public deadline: Date
    ) {}
}

class TaskScheduler {
    private tasks: BinaryHeap<Task>;

    constructor() {
        // Higher priority tasks come first
        this.tasks = new BinaryHeap<Task>((a, b) => a.priority - b.priority);
    }

    public addTask(name: string, priority: number, deadline: Date): void {
        this.tasks.push(new Task(name, priority, deadline));
    }

    public getNextTask(): Task | undefined {
        return this.tasks.pop();
    }

    public peekNextTask(): Task | undefined {
        return this.tasks.peek();
    }
}

// Usage:
const scheduler = new TaskScheduler();
scheduler.addTask("Urgent Bug Fix", 10, new Date());
scheduler.addTask("Regular Maintenance", 5, new Date());
scheduler.addTask("Documentation", 3, new Date());
console.log(scheduler.getNextTask()?.name); // "Urgent Bug Fix"
```

## 2. Event Queue

Handle events based on timestamp:

```typescript
class Event implements PositionTrackable {
    constructor(
        public name: string,
        public timestamp: number,
        public data: any
    ) {}
}

class EventQueue {
    private events: BinaryHeap<Event>;

    constructor() {
        // Earlier timestamps come first
        this.events = new BinaryHeap<Event>((a, b) => b.timestamp - a.timestamp);
    }

    public scheduleEvent(name: string, delay: number, data: any): void {
        const timestamp = Date.now() + delay;
        this.events.push(new Event(name, timestamp, data));
    }

    public processNextEvent(): Event | undefined {
        const event = this.events.pop();
        if (event && event.timestamp <= Date.now()) {
            return event;
        }
        return undefined;
    }
}

// Usage:
const eventQueue = new EventQueue();
eventQueue.scheduleEvent("Timer1", 1000, { action: "alert" });
eventQueue.scheduleEvent("Timer2", 500, { action: "log" });
```

## 3. Network Packet Priority

Handle network packets based on priority:

```typescript
class Packet implements PositionTrackable {
    constructor(
        public data: string,
        public priority: number,
        public size: number
    ) {}
}

class NetworkQueue {
    private packets: BinaryHeap<Packet>;
    
    constructor() {
        this.packets = new BinaryHeap<Packet>((a, b) => a.priority - b.priority);
    }

    public queuePacket(data: string, priority: number, size: number): void {
        this.packets.push(new Packet(data, priority, size));
    }

    public transmitNextPacket(): Packet | undefined {
        return this.packets.pop();
    }
}

// Usage:
const network = new NetworkQueue();
network.queuePacket("Important Data", 1, 1024);
network.queuePacket("Regular Data", 5, 512);
```

## 4. Game Entity Manager

Manage game entities based on their health:

```typescript
class Entity implements PositionTrackable {
    constructor(
        public id: number,
        public health: number,
        public type: string
    ) {}
}

class EntityManager {
    private entities: BinaryHeap<Entity>;

    constructor() {
        // Lower health entities first (for healing/removal)
        this.entities = new BinaryHeap<Entity>((a, b) => b.health - a.health);
    }

    public addEntity(id: number, health: number, type: string): void {
        this.entities.push(new Entity(id, health, type));
    }

    public getMostDamagedEntity(): Entity | undefined {
        return this.entities.peek();
    }

    public removeEntity(): Entity | undefined {
        return this.entities.pop();
    }
}

// Usage:
const manager = new EntityManager();
manager.addEntity(1, 100, "player");
manager.addEntity(2, 30, "enemy");
manager.addEntity(3, 50, "npc");
```

Key Benefits:
1. O(1) access to highest/lowest priority element
2. O(log n) insertions and deletions
3. Memory efficient
4. Natural priority ordering
5. Self-balancing structure

Common Use Cases:
- Priority queues
- Task scheduling
- Event processing
- Pathfinding algorithms (Dijkstra's)
- Resource management
- Load balancing
- Game AI decision making 