# Segment Tree Examples

A Segment Tree is excellent for range-based queries and updates on arrays. Here are some practical examples:

## 1. Range Sum Calculator

Track sums over ranges in a financial application:

```typescript
class FinancialRangeCalculator {
    private transactions: SegmentTree;

    constructor(initialValues: number[]) {
        this.transactions = new SegmentTree(
            initialValues,
            (a, b) => a + b,
            0
        );
    }

    public updateTransaction(index: number, amount: number): void {
        this.transactions.update(index, amount);
    }

    public getRangeSum(start: number, end: number): number {
        return this.transactions.queryRange(start, end);
    }
}

// Usage:
const calculator = new FinancialRangeCalculator([10, 20, 30, 40, 50]);
console.log(calculator.getRangeSum(1, 3)); // 90 (20+30+40)
calculator.updateTransaction(2, 35);
console.log(calculator.getRangeSum(1, 3)); // 95 (20+35+40)
```

## 2. Range Minimum Query

Find minimum values in ranges (useful for stock prices):

```typescript
class StockPriceAnalyzer {
    private prices: SegmentTree;

    constructor(initialPrices: number[]) {
        this.prices = new SegmentTree(
            initialPrices,
            (a, b) => Math.min(a, b),
            Infinity
        );
    }

    public updatePrice(index: number, price: number): void {
        this.prices.update(index, price);
    }

    public getMinimumInRange(start: number, end: number): number {
        return this.prices.queryRange(start, end);
    }
}

// Usage:
const analyzer = new StockPriceAnalyzer([100, 80, 90, 70, 85]);
console.log(analyzer.getMinimumInRange(0, 2)); // 80
analyzer.updatePrice(1, 75);
console.log(analyzer.getMinimumInRange(0, 2)); // 75
```

## 3. Range Maximum Query

Track maximum values in sensor readings:

```typescript
class SensorDataAnalyzer {
    private readings: SegmentTree;

    constructor(initialReadings: number[]) {
        this.readings = new SegmentTree(
            initialReadings,
            (a, b) => Math.max(a, b),
            -Infinity
        );
    }

    public updateReading(index: number, value: number): void {
        this.readings.update(index, value);
    }

    public getMaxInRange(start: number, end: number): number {
        return this.readings.queryRange(start, end);
    }
}

// Usage:
const sensors = new SensorDataAnalyzer([23, 25, 22, 27, 24]);
console.log(sensors.getMaxInRange(1, 3)); // 27
sensors.updateReading(2, 26);
console.log(sensors.getMaxInRange(1, 3)); // 27
```

## 4. Range Product Calculator

Calculate products over ranges (useful for compound effects):

```typescript
class CompoundEffectCalculator {
    private multipliers: SegmentTree;

    constructor(initialValues: number[]) {
        this.multipliers = new SegmentTree(
            initialValues,
            (a, b) => a * b,
            1
        );
    }

    public updateMultiplier(index: number, value: number): void {
        this.multipliers.update(index, value);
    }

    public getRangeProduct(start: number, end: number): number {
        return this.multipliers.queryRange(start, end);
    }
}

// Usage:
const calculator = new CompoundEffectCalculator([1.1, 1.2, 0.9, 1.1, 1.0]);
console.log(calculator.getRangeProduct(1, 3)); // 1.188 (1.2 * 0.9 * 1.1)
calculator.updateMultiplier(2, 1.0);
console.log(calculator.getRangeProduct(1, 3)); // 1.32 (1.2 * 1.0 * 1.1)
```

Key Benefits:
1. O(log n) range queries
2. O(log n) point updates
3. Flexible for different operations (min, max, sum, product)
4. Maintains historical data
5. Efficient for frequent range queries

Common Use Cases:
- Range sum queries
- Range minimum/maximum queries
- Range product calculations
- Statistical analysis
- Financial calculations
- Sensor data analysis
- Game scoring systems
- Performance monitoring 