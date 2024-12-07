// Advent of Code - Day 7 - Part Two

import { bindCanEval, tryAdd, tryDivide } from "./part1";

function tryConcatenation(a: number, b: number) {
    /*
        This looks like magic, but the principle is fairly simple. What we're checking for is whether the result of `a - b`
        can be divided evenly by the magnitude of `b`. Why? Example:
        
        a = 65
        b = 5
        
        In this case, diff = 60, and bMag = 10
        (reminder: Math.log10 returns the magnitude of the number, ie. log10(10) = 1, log10(100) = 2, etc.)
        (by plugging this into `10 ** (Math.floor(Math.log10(b)) + 1)` we get 10, 100, etc.)
        (think of this like checking if we can shift one number to the right by the number of digits in the other and add them together)
        
        _SO_ if we can divide `diff` by `bMag` it means we know these two numbers _can_ be concatenated at this point (it doesn't
        guarantee that this branch will result in a correct answer, but it's a theoretical possibility)
    */
    const diff = a - b;
    const bMag = 10 ** (Math.floor(Math.log10(b)) + 1);
    return diff > 0 && diff % bMag === 0 ? diff / bMag : -1;
}


export function part2(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        // biome-ignore lint/style/noNonNullAssertion: we know the numbers are there
        .map((line) => line.match(/\d+/g)!.map(Number));

    const evalsTo = bindCanEval([tryDivide, tryAdd, tryConcatenation]);
    return items.filter(([target, ...equation]) => evalsTo(equation, target)).reduce((acc, [target]) => acc + target, 0);
}
