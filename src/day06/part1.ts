// Advent of Code - Day 6 - Part One

// Up, Right, Down, Left
export const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function* gridIterator<T>(grid: T[][]): Generator<[number, number, T]> {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            yield [x, y, grid[y][x]];
        }
    }
}

export class Grid<T> {
    constructor(public readonly items: T[][]) { }
    find(char: string): Array<[number, number]> {
        const found: Array<[number, number]> = [];
        for (const [x, y, item] of gridIterator(this.items)) {
            if (item === char) {
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

export function nextDirection(direction: typeof DIRECTIONS[number]): typeof DIRECTIONS[number] {
    return DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % 4];
}

export function testPath(grid: Grid<string>, initialPos: [number, number], direction: typeof DIRECTIONS[number], visited: Set<string>, loopDetection = false): boolean | undefined {
    let position = [...initialPos];

    while (true) {
        const [x, y] = position;
        const [dx, dy] = direction;
        const [nx, ny] = [x + dx, y + dy];
        const key = `${nx},${ny}${loopDetection ? `${direction.join(',')}` : ''}`;

        if (loopDetection && visited.has(key)) return true;

        const nextLocation = grid.get(nx, ny);
        // Out of Bounds - no loop, end of path
        if (nextLocation === undefined) return false;
        // If there's a barrier, turn around, otherwise move to the next position
        if (nextLocation === '#') {
            return testPath(grid, [nx - dx, ny - dy], nextDirection(direction), visited, loopDetection);
        }
        position = [nx, ny];
        visited.add(key);
    }
}

export function part1(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));
    const grid = new Grid(items);
    const [initialPosition] = grid.find('^');
    const visited = new Set<string>([`${initialPosition[0]},${initialPosition[1]}`]);
    testPath(grid, initialPosition, DIRECTIONS[0], visited);

    for (const [x, y] of Array.from(visited).map((v) => v.split(',').map(Number))) {
        items[y][x] = 'X';
    }

    return visited.size;
}
