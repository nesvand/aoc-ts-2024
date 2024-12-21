// Advent of Code - Day 21 - Part Two

import { processCodes } from "./part1";

export function part2(input: string): bigint {
    const codes = input.trim().split('\n');
    return processCodes(codes, 26);
}
