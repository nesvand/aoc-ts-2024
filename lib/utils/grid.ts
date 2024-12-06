export class Grid<T> {
    constructor(public readonly items: T[][]) { }
    *iterate(): Generator<[number, number, T]> {
        for (let y = 0; y < this.items.length; y++) {
            for (let x = 0; x < this.items[y].length; x++) {
                yield [x, y, this.items[y][x]];
            }
        }
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
    toString(): string {
        return this.items.map((row) => row.join('')).join('\n');
    }
}
