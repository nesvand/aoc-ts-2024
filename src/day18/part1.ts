// Advent of Code - Day 18 - Part One

import { Grid } from "@lib/grid";
import { alg, Graph, type Edge } from "@dagrejs/graphlib";

export const directions = [
    [0, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
];

export function runDjikstra(grid: Grid<number>, incomingBytes: Array<[number, number]>, width: number, height: number, previousCount?: number, newCount?: number): number {
    if (previousCount !== undefined && newCount !== undefined) {
        for (let i = previousCount; i < newCount; i++) {
            const [x, y] = incomingBytes[i];
            grid.set(x, y, 1);
        }
    }

    const g = new Graph();
    for (const [x, y, v] of grid) {
        if (v >= 1) continue;
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const nv = grid.get(nx, ny);
            if (nv === undefined) continue;
            if (nv >= 1) continue;
            g.setEdge(`${x},${y}`, `${nx},${ny}`);
        }
    }
    const weight = (_: Edge) => 1;
    const paths = alg.dijkstra(g, '0,0', weight);
    const end = `${width - 1},${height - 1}`;

    const pathToEnd = [end];
    let path = paths[end];
    if (path.predecessor === undefined) return -1;
    while (pathToEnd !== undefined && path.distance !== 0) {
        pathToEnd.unshift(path.predecessor);
        path = paths[path.predecessor];
    }

    return pathToEnd.length - 1;
}

export function part1(input: string, width = 71, height = 71, initialIndex = 1024): number {
    const incomingBytes = input.trim().split('\n').map(line => line.split(',').map(Number)) as Array<[number, number]>;
    const grid = Grid.from(width, height, () => 0);

    for (let i = 0; i < initialIndex; i++) {
        const [x, y] = incomingBytes[i];
        grid.set(x, y, 1);
    }

    return runDjikstra(grid, incomingBytes, width, height, initialIndex);
}
