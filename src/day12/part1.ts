// Advent of Code - Day 12 - Part One

import { Grid } from "@lib/grid";

// Down, Up, Left, Right
const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

function group(x: number, y: number, grid: Grid<string>, toVisit: Set<string>): Array<{ p: [number, number]; edges: number; }> {
    if (!toVisit.delete(`${x},${y}`)) return [];

    let edges = 0;
    const rest: Array<{ p: [number, number]; edges: number; }> = [];
    for (const [dx, dy] of directions) {
        const [nx, ny] = [x + dx, y + dy];
        if (!grid.get(nx, ny) || grid.get(nx, ny) !== grid.get(x, y)) {
            edges++;
            continue;
        }
        rest.push(...group(nx, ny, grid, toVisit));
    }

    return [{ p: [x, y], edges }, ...rest];
}

export function part1(input: string): number {
    const items = input.trim().split('\n').map((line) => line.trim().split(''));
    const grid = new Grid(items);

    const toVisit = new Set<string>();
    for (const [x, y] of grid.iterate()) {
        toVisit.add(`${x},${y}`);
    }

    const groups: Array<ReturnType<typeof group>> = [];
    const visitIterator = toVisit.values();
    while (true) {
        const entry = visitIterator.next();
        if (entry.done) {
            break;
        }
        const [x, y] = entry.value.split(',').map((n) => Number.parseInt(n));
        groups.push(group(x, y, grid, toVisit));
    }

    const areas = groups.map((g) => g.length);
    const perimeters = groups.map((g) => g.reduce((sum, v) => sum + v.edges, 0));
    const total = areas.reduce((total, v, i) => total + v * perimeters[i], 0);

    return total;
}
