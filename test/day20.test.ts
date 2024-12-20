// Advent of Code - Day 20
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day20';

let input = '';
try {
    input = await Bun.file('src/day20/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`, 20)).toBe(5);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(1422);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`, 70)).toBe(41);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(1009299);
    });
}
