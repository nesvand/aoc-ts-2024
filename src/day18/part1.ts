// Advent of Code - Day 18 - Part One

import { Grid } from "@lib/grid";
import { mod } from "@lib/math";
import { alg, Graph, type Edge } from "@dagrejs/graphlib";

export const directions = [
    [0, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
];

export function runDjikstra(grid: Grid<number>, width: number, height: number, exitBeforeStart = false): number {
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
    if (exitBeforeStart && path.predecessor === undefined) return -1;
    while (pathToEnd !== undefined && path.distance !== 0) {
        pathToEnd.unshift(path.predecessor);
        path = paths[path.predecessor];
    }

    return pathToEnd.length - 1;
}

export function part1(input: string, width = 71, height = 71, initialState = 1024): number {
    const incomingBytes = input.trim().split('\n').map(line => line.split(',').map(Number)) as Array<[number, number]>;
    const grid = Grid.from(width, height, () => 0);

    for (let i = 0; i < initialState; i++) {
        const [x, y] = incomingBytes[mod(i, incomingBytes.length)];
        grid.set(x, y, 1);
    }

    return runDjikstra(grid, width, height);
}
