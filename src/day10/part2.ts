// Advent of Code - Day 10 - Part Two

import { Grid } from "@lib/grid";
import { bindNextLocs } from "./part1";

export function part2(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').map(Number));
    const grid = new Grid(items);
    const getNextLocs = bindNextLocs(grid);
    const starts = grid.find(0);

    let result = 0;
    for (const start of starts) {
        let nextLocs = [start];
        while (nextLocs.length > 0) {
            const foundLocs: [number, number][] = [];

            for (const [x, y] of nextLocs) {
                if (grid.get(x, y) === 9) result++;
                else foundLocs.push(...getNextLocs(x, y));
            }

            nextLocs = foundLocs;
        }
    }

    return result;
}
