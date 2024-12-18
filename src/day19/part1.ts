// Advent of Code - Day 19 - Part One

import memoize from "memoize";

export function part1(input: string): number {
    const [patternsInput, designsInput] = input.trim().split('\n\n');
    const patterns = patternsInput.split(', ');
    const designs = designsInput.split('\n');

    const canMakeDesign = memoize((design: string, patterns: string[]): boolean => {
        if (design === "") return true;

        for (const pattern of patterns) {
            if (design.startsWith(pattern)) {
                if (canMakeDesign(design.slice(pattern.length), patterns)) {
                    return true;
                }
            }
        }
        return false;
    });

    let possible = 0;
    for (const design of designs) {
        if (canMakeDesign(design, patterns)) possible++;
    }
    return possible;
}
