// Advent of Code - Day 14
import { expect, test } from 'bun:test';
import { part1 } from '../src/day14';

let input = '';
try {
    input = await Bun.file('src/day14/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`, 11, 7)).toBe(12);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(209409792);
    });
}

// test('part two test', async () => {
//     // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
//     expect(part2(``)).toBe(0);
// });

// if (input !== '') {
//     test('part two answer', async () => {
//         expect(await part2(input)).toBe(0);
//     });
// }
