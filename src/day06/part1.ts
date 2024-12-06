// Advent of Code - Day 6 - Part One

import { Grid } from '@lib/grid';

// Up, Right, Down, Left
export const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export function nextDirection(direction: typeof DIRECTIONS[number]): typeof DIRECTIONS[number] {
    return DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % 4];
}

export function testPath(grid: Grid<string>, initialPos: [number, number], initialDirection: typeof DIRECTIONS[number], visited: Set<string>, detectLoop = false): boolean {
    let position = [...initialPos];
    let direction = initialDirection;

    while (true) {
        const [x, y] = position;
        const [dx, dy] = direction;
        const [nx, ny] = [x + dx, y + dy];

        // By optionally tracking the direction we can we see if we're following the exact same path again (looping)
        const key = `${nx},${ny}${detectLoop ? `${direction.join(',')}` : ''}`;
        if (detectLoop && visited.has(key)) return true;

        const nextLocation = grid.get(nx, ny);

        // Out of Bounds - no loop, end of path
        if (nextLocation === undefined) return false;

        // If there's a barrier, turn around, otherwise move to the next position
        if (nextLocation === '#') {
            direction = nextDirection(direction);
        } else {
            position = [nx, ny];
            visited.add(key);
        }
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

    return visited.size;
}
