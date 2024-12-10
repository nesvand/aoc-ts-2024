// Advent of Code - Day 10 - Part One

import { Grid } from "@lib/grid";

export function nextLocs(grid: Grid<number>, x: number, y: number): [number, number][] {
    const current = grid.get(x, y);
    if (current === undefined) throw new Error(`No current at ${x}, ${y}: ${current}`);
    const next: [number, number][] = [];
    if (grid.get(x + 1, y) === current + 1) next.push([x + 1, y]);
    if (grid.get(x - 1, y) === current + 1) next.push([x - 1, y]);
    if (grid.get(x, y + 1) === current + 1) next.push([x, y + 1]);
    if (grid.get(x, y - 1) === current + 1) next.push([x, y - 1]);

    return next;
}

export function part1(input: string): number {
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
            for (const [i, [x, y]] of found.entries()) {
                for (let j = i + 1; j < found.length; j++) {
                    if (found[j][0] === x && found[j][1] === y) found[j] = [Number.NaN, Number.NaN];
                }
            }
            next = found.filter(([x, y]) => !Number.isNaN(x) && !Number.isNaN(y));
        }
    }

    return result;
}
