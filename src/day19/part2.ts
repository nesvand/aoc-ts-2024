// Advent of Code - Day 19 - Part Two

import { memoizeRecursive } from "@lib/general";

export function part2(input: string): number {
    const [patternsInput, designsInput] = input.trim().split('\n\n');
    const patterns = patternsInput.split(', ');
    const designs = designsInput.split('\n');

    const countValidPatterns = memoizeRecursive((it: (d: string, p: string[]) => number, design: string, patterns: string[]) => {
        if (design === "") return 1;

        let count = 0;
        for (const pattern of patterns) {
            if (design.startsWith(pattern)) {
                count += it(design.slice(pattern.length), patterns);
            }
        }
        return count;
    }, { resolver: (d) => d });

    let count = 0;
    for (const design of designs) {
        count += countValidPatterns(design, patterns);
    }
    return count;
}
