// Advent of Code - Day 1
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day01';

let input = '';
try {
    input = await Bun.file('src/day01/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`3   4
4   3
2   5
1   3
3   9
3   3`)).toBe(11);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(2285373);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`3   4
4   3
2   5
1   3
3   9
3   3`)).toBe(31);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(21142653);
    });
}
