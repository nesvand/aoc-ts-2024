// Advent of Code - Day 13 - Part Two

import { minTokens } from "./part1";

export function part2(input: string): number {
    const items = input.trim()
        .split('\n\n')
        .map((lines) => {
            const [a, b, prize] = lines.split('\n');
            const [ax, ay] = a.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            const [bx, by] = b.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            const [px, py] = prize.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            return {
                a: { x: ax, y: ay },
                b: { x: bx, y: by },
                prize: { x: px + 10_000_000_000_000, y: py + 10_000_000_000_000 },
            };
        });
    let tokens = 0;
    for (const { a, b, prize } of items) {
        const presses = minTokens([a.x, a.y], [b.x, b.y], [prize.x, prize.y]);
        if (presses === null) continue;
        tokens += presses.a * 3 + presses.b;
    }
    return tokens;
}
