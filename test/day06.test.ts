// Advent of Code - Day 6
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day06';

let input = '';
try {
    input = await Bun.file('src/day06/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`)).toBe(41);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(4711);
    });
}

test('part two test', async () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(await part2(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`)).toBe(6);
});

if (input !== '') {
    test('part two answer', async () => {
        expect(await part2(input)).toBe(1562);
    });
}
