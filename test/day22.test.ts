// Advent of Code - Day 22
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day22';

let input = '';
try {
    input = await Bun.file('src/day22/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`1
10
100
2024
`)).toBe(37327623);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(20332089158);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`1
2
3
2024
`)).toBe(23);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(2191);
    });
}
