// Advent of Code - Day 8 - Part Two

import { Grid } from "@lib/grid";
import { calcNodeLocationPairs } from "./part1";

export function part2(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));
    const grid = new Grid(items);
    const nodeLocationPairs = calcNodeLocationPairs(grid);

    for (const [, pairs] of Object.entries(nodeLocationPairs)) {
        for (const [a, b] of pairs) {
            const [x1, y1] = a;
            const [x2, y2] = b;
            const slopeY = y2 - y1;
            const slopeX = x2 - x1;
            for (let y = 0; y < grid.height; y++) {
                const dr = y - y1;
                const dx = dr * slopeX / slopeY;
                const x = x1 + dx;
                if (x < 0 || x >= grid.width) continue;
                grid.set(x, y, '#');
            }
        }
    }

    const count = grid.find('#').length;
    return count;
}
