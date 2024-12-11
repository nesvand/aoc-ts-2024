// Advent of Code - Day 11 - Part Two

import { memoize, processStone } from "./part1";

export function part2(input: string): number {
    const stones = input.trim().split(' ').map(Number);
    const _processStone = memoize(processStone);

    const blinks = 75;
    let total = 0;
    for (const stone of stones) {
        total += _processStone(stone, blinks);
    }

    return total;
}
