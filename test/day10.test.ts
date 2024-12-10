// Advent of Code - Day 10
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day10';

let input = '';
try {
    input = await Bun.file('src/day10/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`)).toBe(36);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(786);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`)).toBe(81);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(1722);
    });
}
