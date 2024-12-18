// Advent of Code - Day 18
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day18';

let input = '';
try {
    input = await Bun.file('src/day18/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`, 7, 7, 12)).toBe(22);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(316);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`, 7, 7, 12)).toBe('6,1');
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe('45,18');
    });
}
