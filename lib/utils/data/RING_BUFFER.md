# Ring Buffer Examples

A Ring Buffer is perfect for scenarios where you need to maintain a fixed-size history or circular queue. Here are some practical examples:

## 1. Command History

Track recent commands in a terminal:

```typescript
class CommandHistory {
    private history: RingBuffer<string>;

    constructor(maxHistory: number) {
        this.history = new RingBuffer<string>(maxHistory);
    }

    public addCommand(cmd: string): void {
        this.history.push(cmd);
    }

    public getRecentCommands(): string[] {
        return this.history.toArray();
    }

    public getLastCommand(): string | undefined {
        return this.history.peek();
    }
}

// Usage:
const cmdHistory = new CommandHistory(3);
cmdHistory.addCommand("ls");
cmdHistory.addCommand("cd ..");
cmdHistory.addCommand("pwd");
cmdHistory.addCommand("git status"); // Overwrites "ls"
console.log(cmdHistory.getRecentCommands()); // ["git status", "cd ..", "pwd"]
```

## 2. Moving Average Calculator

Calculate moving average over a fixed window:

```typescript
class MovingAverage {
    private values: RingBuffer<number>;
    private sum: number;

    constructor(windowSize: number) {
        this.values = new RingBuffer<number>(windowSize);
        this.sum = 0;
    }

    public addValue(value: number): number {
        const oldestValue = this.values.isFull ? this.values.get(this.values.pointer) : 0;
        this.sum = this.sum - oldestValue + value;
        this.values.push(value);
        return this.getAverage();
    }

    public getAverage(): number {
        const count = this.values.toArray().length;
        return count > 0 ? this.sum / count : 0;
    }
}

// Usage:
const avg = new MovingAverage(3);
console.log(avg.addValue(1)); // 1
console.log(avg.addValue(2)); // 1.5
console.log(avg.addValue(3)); // 2
console.log(avg.addValue(4)); // 3 (1 was dropped)
```

## 3. Event Logger

Keep track of recent events:

```typescript
interface LogEvent {
    timestamp: number;
    level: string;
    message: string;
}

class EventLogger {
    private logs: RingBuffer<LogEvent>;

    constructor(maxEvents: number) {
        this.logs = new RingBuffer<LogEvent>(maxEvents);
    }

    public log(level: string, message: string): void {
        this.logs.push({
            timestamp: Date.now(),
            level,
            message
        });
    }

    public getRecentLogs(): LogEvent[] {
        return this.logs.toArray();
    }

    public getLastLog(): LogEvent | undefined {
        return this.logs.peek();
    }
}

// Usage:
const logger = new EventLogger(5);
logger.log("INFO", "Application started");
logger.log("WARNING", "High memory usage");
logger.log("ERROR", "Database connection failed");
```

## 4. Audio Buffer

Manage an audio playback buffer:

```typescript
class AudioBuffer {
    private samples: RingBuffer<number>;
    private sampleRate: number;

    constructor(bufferSeconds: number, sampleRate: number) {
        this.sampleRate = sampleRate;
        const bufferSize = bufferSeconds * sampleRate;
        this.samples = new RingBuffer<number>(bufferSize);
    }

    public addSample(sample: number): void {
        this.samples.push(sample);
    }

    public getSampleAt(index: number): number {
        return this.samples.get(index);
    }

    public getBufferLength(): number {
        return this.samples.size;
    }
}

// Usage:
const audioBuffer = new AudioBuffer(2, 44100); // 2 seconds at 44.1kHz
for (let i = 0; i < 1000; i++) {
    audioBuffer.addSample(Math.random()); // Add audio samples
}
```

Key Benefits:
1. Constant memory usage
2. Fast insertions and lookups
3. Automatic overwriting of old data
4. Perfect for sliding windows
5. Efficient circular queue implementation

Common Use Cases:
- Command history
- Moving averages
- Event logging
- Audio/Video buffering
- Network packet buffering
- Sensor data collection
- Game state history
- Performance monitoring 