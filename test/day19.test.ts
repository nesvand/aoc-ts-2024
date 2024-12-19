// Advent of Code - Day 19
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day19';

let input = '';
try {
    input = await Bun.file('src/day19/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`)).toBe(6);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(327);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`)).toBe(16);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(772696486795255);
    });
}
