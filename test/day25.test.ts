// Advent of Code - Day 25
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day25';

let input = '';
try {
    input = await Bun.file('src/day25/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`)).toBe(3);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(0);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(``)).toBe(0);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(0);
    });
}
