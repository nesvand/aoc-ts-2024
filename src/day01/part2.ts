// Advent of Code - Day 1 - Part Two

export function part2(input: string): number {
    const left: number[] = [];
    const right: number[] = [];
    const rightMap: Record<number, number> = {};
    input.split('\n').filter(Boolean).map((line) => {
        const [l, r] = line.split('  ').map((item) => Number.parseInt(item, 10));
        left.push(l);
        right.push(r);
        rightMap[r] ??= 0;
        rightMap[r]++;
    });
    return left.reduce((acc, curr) => acc + (curr * (rightMap[curr] ?? 0)), 0);
}
