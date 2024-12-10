// Advent of Code - Day 10 - Part Two

import { Grid } from "@lib/grid";
import { nextLocs } from "./part1";

export function part2(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').map(Number));
    const grid = new Grid(items);
    const starts = grid.find(0);

    let result = 0;
    for (const start of starts) {
        let next = [start];
        while (next.length > 0) {
            const found: [number, number][] = [];
            for (const [x, y] of next) {
                if (grid.get(x, y) === 9) result++;
                else found.push(...nextLocs(grid, x, y));
            }
            next = found;
        }
    }

    return result;
}
