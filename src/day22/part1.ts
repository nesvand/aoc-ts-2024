// Advent of Code - Day 22 - Part One

const MASK = (1 << 24) - 1; // 16777216 - 1 (a % b === a & (b - 1))

export function generateNextCode(code: number): number {
    let next = code;
    // * 64 = << 6 and % 16777216 = & ((1 << 24) - 1) `MASK`
    next = (next ^ (next << 6)) & MASK;
    // / 32 = >> 5
    next = (next ^ (next >> 5)) & MASK;
    // * 2048 = << 11
    next = (next ^ (next << 11)) & MASK;
    return next;
}

export function part1(input: string): number {
    const codes = input
        .trim().split('\n').map(Number);

    const finalCodes: number[] = [];
    for (const code of codes) {
        let next = code;
        for (let i = 0; i < 2000; i++) {
            next = generateNextCode(next);
        }
        finalCodes.push(next);
    }

    return finalCodes.reduce((acc, cur) => acc + cur, 0);
}
