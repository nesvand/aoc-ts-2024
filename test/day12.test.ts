// Advent of Code - Day 12
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day12';

let input = '';
try {
    input = await Bun.file('src/day12/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`)).toBe(1930);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(1494342);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`)).toBe(1206);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(893676);
    });
}
