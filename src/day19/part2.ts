// Advent of Code - Day 19 - Part Two

export function part2(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));
    console.log(items);
    return 0;
}
