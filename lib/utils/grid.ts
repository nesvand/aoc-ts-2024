export class Grid<T> {
    constructor(public readonly items: T[][]) { }
    *iterate(): Generator<[number, number, T]> {
        for (let y = 0; y < this.items.length; y++) {
            for (let x = 0; x < this.items[y].length; x++) {
                yield [x, y, this.items[y][x]];
            }
        }
    }
    [Symbol.iterator](): Iterator<[number, number, T]> {
        return this.iterate();
    }
    static from<F>(width: number, height: number, value: F): Grid<F> {
        const items = Array.from({ length: height }, () => Array.from({ length: width }, () => value));
        return new Grid(items);
    }
    find(token: T, compare = (a: T, b: T) => a === b): Array<[number, number]> {
        const found: Array<[number, number]> = [];
        for (const [x, y, item] of this.iterate()) {
            if (compare(token, item)) {
                found.push([x, y]);
            }
        }
        return found;
    }
    get(x: number, y: number): T | undefined {
        return this.items[y]?.[x];
    }
    set(x: number, y: number, value: T): boolean {
        if (this.items[y] === undefined) return false;
        if (this.items[y][x] === undefined) return false;
        this.items[y][x] = value;
        return true;
    }
    clone(): Grid<T> {
        return new Grid(this.items.map((row) => row.slice()));
    }
    toString(): string {
        return this.items.map((row) => row.join('')).join('\n');
    }
    get height(): number {
        return this.items.length;
    }
    get width(): number {
        return this.items[0].length;
    }
    [Symbol.iterator](): Iterator<[number, number, T]> {
        let x = 0;
        let y = 0;
        return {
            next: () => {
                if (x >= this.items[0].length) {
                    x = 0;
                    y += 1;
                }
                if (y >= this.items.length) {
                    return { done: true, value: undefined };
                }
                const item = this.items[y][x];
                x += 1;
                return { done: false, value: [x - 1, y, item] };
            },
        };
    }
}
