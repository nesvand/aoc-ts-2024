// Advent of Code - Day 7
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day07';

let input = '';
try {
    input = await Bun.file('src/day07/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`)).toBe(3749);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(4122618559853);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`)).toBe(0);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(0);
    });
}
