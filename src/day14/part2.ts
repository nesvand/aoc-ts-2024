// Advent of Code - Day 14 - Part Two

import readline from "node:readline";
import { Grid } from "@lib/grid";
import { nextpos } from "./part1";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export async function part2(input: string, width = 101, height = 103): Promise<number> {
    if (!input) return 0;
    const items = input.trim().split('\n')
        .map((line) => {
            const [point, velocity] = line.split(' ');
            const [px, py] = point.slice(2).split(',').map(Number);
            const [vx, vy] = velocity.slice(2).split(',').map(Number);
            return { point: [px, py], velocity: [vx, vy] } as { point: [number, number]; velocity: [number, number]; };
        });
    let minDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 100_000_000; i++) {
        for (const [idx, { point, velocity }] of items.entries()) {
            const [nx, ny] = nextpos(point, velocity, width, height);
            items[idx].point = [nx, ny];
        }
        const points = items.map(({ point }) => point);
        let d = 0;
        for (const [x, y] of points) {
            d += Math.abs(x - points[0][0]);
            d += Math.abs(y - points[0][1]);
        }
        if (d < minDist) {
            minDist = d;
            const grid = Grid.from(width, height, () => 0);
            for (const [x, y] of points) {
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                grid.set(x, y, grid.get(x, y)! + 1);
            }
            console.log(i);
            console.log(grid.toString());
            void await new Promise((resolve) => {
                rl.question('Continue?', () => resolve(undefined));
            });
        }
    }
    return 0;
}
