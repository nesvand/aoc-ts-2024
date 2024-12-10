// Advent of Code - Day 9
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day09';

let input = '';
try {
    input = await Bun.file('src/day09/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`2333133121414131402`)).toBe(1928);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(6401092019345);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`2333133121414131402`)).toBe(2858);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(6431472344710);
    });
}
