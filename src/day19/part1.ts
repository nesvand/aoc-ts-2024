// Advent of Code - Day 19 - Part One

export function part1(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));
    console.log(items);
    return 0;
}
