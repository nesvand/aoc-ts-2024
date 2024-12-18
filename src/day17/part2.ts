// Advent of Code - Day 17 - Part Two

import { createProgram } from "./part1";

export function part2(input: string): bigint {
    const { searchForA } = createProgram(input);

    // for (let aVal = 0n; aVal < Number.MAX_SAFE_INTEGER; aVal++) {
    //     if (bruteForce(aVal) >= 0) {
    //         return bruteForce(aVal);
    //     }
    // }

    return searchForA();
}
