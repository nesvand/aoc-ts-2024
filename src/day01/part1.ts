// Advent of Code - Day 1 - Part One

export function part1(input: string): number {
    const left: number[] = [];
    const right: number[] = [];
    input.split('\n').filter(Boolean).map((line) => {
        const [l, r] = line.split('  ').map((item) => Number.parseInt(item, 10));
        left.push(l);
        right.push(r);
    });
    left.sort();
    right.sort();
    return left.reduce((acc, curr, i) => Math.abs(curr - right[i]) + acc, 0);
}
