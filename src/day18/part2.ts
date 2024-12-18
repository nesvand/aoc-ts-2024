// Advent of Code - Day 18 - Part Two

import { Grid } from "@lib/grid";
import { mod } from "@lib/math";
import { runDjikstra } from "./part1";

export function part2(input: string, width = 71, height = 71, initialState = 1024): string {
    const incomingBytes = input.trim().split('\n').map(line => line.split(',').map(Number)) as Array<[number, number]>;
    const grid = Grid.from(width, height, () => 0);

    for (let i = 0; i < initialState; i++) {
        const [x, y] = incomingBytes[mod(i, incomingBytes.length)];
        grid.set(x, y, 1);
    }

    for (let i = initialState; i < incomingBytes.length; i++) {
        const [x, y] = incomingBytes[i];
        grid.set(x, y, 1);
        const pathLength = runDjikstra(grid, width, height, true);
        if (pathLength === -1) return incomingBytes[i].join(',');
    }

    throw new Error('unreachable');
}
