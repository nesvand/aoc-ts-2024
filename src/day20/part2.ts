// Advent of Code - Day 20 - Part Two

import { Grid } from "@lib/grid";
import { bfsAll } from "./part1";
import type ManyKeyMap from 'many-keys-map';

export function part2(input: string, minSavedSteps = 100): number {
    const items = input.trim().split('\n').map((line) => line.split(''));
    const grid = new Grid(items);
    const [startX, startY] = grid.find('S')[0];

    const distances: ManyKeyMap<[number, number], number> = bfsAll(grid, [startX, startY]);

    let cheats = 0;
    for (const [[ax, ay], distA] of distances.entries()) {
        for (const [[bx, by], distB] of distances.entries()) {
            if (ax === bx && ay === by) continue;

            const taxiDist = Math.abs(ax - bx) + Math.abs(ay - by);
            if (taxiDist <= 20 && distA - distB - taxiDist >= minSavedSteps) cheats++;
        }
    }

    return cheats;
}
