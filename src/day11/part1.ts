// Advent of Code - Day 11 - Part One

import { memoizeRecursive } from '@lib/general';

/*
    Rules:
    - If stone equals 0, replace the stone with a value of 1
    - If the stone has an even number of digits (ie. 12, 1234, 123456, etc.), split the number into two numbers, and replace with two stones of those values
      - ie. 12 becomes 1 and 2, 1234 becomes 12 and 34, 123456 becomes 123 and 456
    - If none of the other rules apply, the stone is replaced by a new stone multiplied by 2024, ie. 100 becomes 202400
    - Order is preserved
*/

export const processStone = memoizeRecursive(
    (_processStone: (stone: number, blinks: number) => number, stone: number, blinks: number): number => {
        if (blinks === 0) return 1;

        let total = 0;
        const stoneString = stone.toString();
        if (stone === 0) total = _processStone(1, blinks - 1);
        else if (stoneString.length % 2 === 0) {
            const left = Number.parseInt(stoneString.slice(0, stoneString.length / 2));
            const right = Number.parseInt(stoneString.slice(-stoneString.length / 2));
            total = _processStone(left, blinks - 1) + _processStone(right, blinks - 1);
        } else {
            total = _processStone(stone * 2024, blinks - 1);
        }
        return total;
    },
);

export function part1(input: string): number {
    const stones = input.trim().split(' ').map(Number);

    const blinks = 25;
    let total = 0;
    for (const stone of stones) {
        total += processStone(stone, blinks);
    }

    return total;
}
