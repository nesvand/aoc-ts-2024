// Advent of Code - Day 11 - Part Two

import { processStone } from './part1';

export function part2(input: string): number {
    const stones = input.trim().split(' ').map(Number);

    const blinks = 75;
    let total = 0;
    for (const stone of stones) {
        total += processStone(stone, blinks);
    }

    return total;
}
