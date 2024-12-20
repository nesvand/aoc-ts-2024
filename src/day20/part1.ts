// Advent of Code - Day 20 - Part One

import { Grid } from "@lib/grid";
import ManyKeyMap from 'many-keys-map';

export const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

export function bfsAll(grid: Grid<string>, start: [number, number]): ManyKeyMap<[number, number], number> {
    // [[x, y], steps]
    const queue: Array<[[number, number], number]> = [];
    const stepsToLoc: ManyKeyMap<[number, number], number> = new ManyKeyMap();

    queue.push([start, 0]);
    stepsToLoc.set(start, 0);

    while (queue.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: We know that queue is not empty
        const [[x, y], steps] = queue.shift()!;

        for (const [nx, ny] of directions.map(([dx, dy]) => [x + dx, y + dy])) {
            const next = grid.get(nx, ny);
            if (next === undefined || next === '#') continue;

            const newSteps = steps + 1;
            const oldSteps = stepsToLoc.get([nx, ny]);
            if (oldSteps === undefined || oldSteps > newSteps) {
                queue.push([[nx, ny], newSteps]);
                stepsToLoc.set([nx, ny], newSteps);
            }
        }
    }

    return stepsToLoc;
}

export function part1(input: string, minSavedSteps = 100): number {
    const items = input.trim().split('\n').map((line) => line.split(''));
    const grid = new Grid(items);
    const [startX, startY] = grid.find('S')[0];

    const distances: ManyKeyMap<[number, number], number> = bfsAll(grid, [startX, startY]);

    let cheats = 0;
    for (const [[ax, ay], distA] of distances.entries()) {
        for (const [[bx, by], distB] of distances.entries()) {
            if (ax === bx && ay === by) continue;

            const taxiDist = Math.abs(ax - bx) + Math.abs(ay - by);
            if (taxiDist <= 2 && distA - distB - taxiDist >= minSavedSteps) cheats++;
        }
    }

    return cheats;
}
