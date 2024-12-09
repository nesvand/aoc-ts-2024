// Advent of Code - Day 8
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day08';

let input = '';
try {
    input = await Bun.file('src/day08/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`)).toBe(14);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(265);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`)).toBe(34);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(962);
    });
}