// Advent of Code - Day 19 - Part Two

import memoize from "memoize";

export function part2(input: string): number {
    const [patternsInput, designsInput] = input.trim().split('\n\n');
    const patterns = patternsInput.split(', ');
    const designs = designsInput.split('\n');

    const countValidPatterns = memoize((design: string, patterns: string[]) => {
        if (design === "") return 1;

        let count = 0;
        for (const pattern of patterns) {
            if (design.startsWith(pattern)) {
                count += countValidPatterns(design.slice(pattern.length), patterns);
            }
        }
        return count;
    });

    let count = 0;
    for (const design of designs) {
        count += countValidPatterns(design, patterns);
    }
    return count;
}
