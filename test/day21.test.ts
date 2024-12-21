// Advent of Code - Day 21
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day21';

let input = '';
try {
    input = await Bun.file('src/day21/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`029A
980A
179A
456A
379A
`)).toBe(126384n);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(184716n);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`029A
980A
179A
456A
379A
`)).toBe(154115708116294n);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(229403562787554n);
    });
}
