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
    // Brute-force - follow the original path and shove a barrier in each location to see if we end up in a loop
    for (const [x, y] of visitedPositions) {
        // Skip the initial position
        if (x === initialPosition[0] && y === initialPosition[1]) continue;

        // Copying the grid value so we don't have to keep copying the entire grid
        const copy = items[y][x];
        items[y][x] = '#';

        // `testPath` returns true when it finds a loop
        if (testPath(grid, initialPosition, DIRECTIONS[0], new Set(), true)) loopsDetected++;
        items[y][x] = copy;
    }
    return loopsDetected;
}
