// Advent of Code - Day 6 - Part Two

import { testPath, Grid, DIRECTIONS } from "./part1";

export function part2(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));

    const grid = new Grid(items);
    const [initialPosition] = grid.find('^');
    const visited = new Set<string>([`${initialPosition.join(',')}`]);
    testPath(grid, initialPosition, DIRECTIONS[0], visited);

    const visitedPositions = Array.from(visited).map((pos) => pos.split(',').map(Number));
    let loopsDetected = 0;
    for (const [x, y] of visitedPositions) {
        if (x === initialPosition[0] && y === initialPosition[1]) continue;
        const copy = items[y][x];
        items[y][x] = '#';
        if (testPath(grid, initialPosition, DIRECTIONS[0], new Set(), true)) loopsDetected++;
        items[y][x] = copy;
    }
    return loopsDetected;
}
