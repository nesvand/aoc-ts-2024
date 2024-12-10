// Advent of Code - Day 10 - Part One

import { Grid } from "@lib/grid";

const directions: [number, number][] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export function bindNextLocs(grid: Grid<number>) {
    return (x: number, y: number): [number, number][] => {
        const current = grid.get(x, y);
        if (current === undefined) throw new Error(`No current at ${x}, ${y}`);
        const next: [number, number][] = [];
        for (const [dx, dy] of directions) {
            if (grid.get(x + dx, y + dy) === current + 1) next.push([x + dx, y + dy]);
        }

        return next;
    }
}

export function part1(input: string): number {
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

            for (const [i, [x, y]] of foundLocs.entries()) {
                for (let j = i + 1; j < foundLocs.length; j++) {
                    if (foundLocs[j][0] === x && foundLocs[j][1] === y) foundLocs[j] = [Number.NaN, Number.NaN];
                }
            }

            nextLocs = foundLocs.filter(([x, y]) => !Number.isNaN(x) && !Number.isNaN(y));
        }
    }

    return result;
}
