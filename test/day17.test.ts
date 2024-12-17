// Advent of Code - Day 17
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day17';

let input = '';
try {
    input = await Bun.file('src/day17/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`)).toBe('4,6,3,5,6,3,5,2,1,0');
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe('2,1,4,0,7,4,0,2,3');
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`)).toBe(117440n);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(258394985014171n);
    });
}
