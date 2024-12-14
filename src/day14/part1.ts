// Advent of Code - Day 14 - Part One

import { memoize } from "@lib/general";
import { mod } from "@lib/math";

export const nextpos = memoize(([px, py]: [number, number], [vx, vy]: [number, number], width: number, height: number): [number, number] => {
    return [mod((px + vx), width), mod((py + vy), height)];
});


export function part1(input: string, width = 101, height = 103): number {
    const items = input.trim().split('\n')
        .map((line) => {
            const [point, velocity] = line.split(' ');
            const [px, py] = point.slice(2).split(',').map(Number);
            const [vx, vy] = velocity.slice(2).split(',').map(Number);
            return { point: [px, py], velocity: [vx, vy] } as { point: [number, number]; velocity: [number, number]; };
        });
    for (let i = 0; i < 100; i++) {
        for (const [idx, { point, velocity }] of items.entries()) {
            const [nx, ny] = nextpos(point, velocity, width, height);
            items[idx].point = [nx, ny];
        }
    }
    const [mx, my] = [Math.floor(width / 2), Math.floor(height / 2)];
    const points = items.map(({ point }) => point);
    let tl = 0;
    let tr = 0;
    let bl = 0;
    let br = 0;
    for (const [x, y] of points) {
        if (x >= 0 && x < mx && y >= 0 && y < my) tl++;
        if (x > mx && x < width && y >= 0 && y < my) tr++;
        if (x >= 0 && x < mx && y > my && y < height) bl++;
        if (x > mx && x < width && y > my && y < height) br++;
    }

    return tl * tr * bl * br;
}
