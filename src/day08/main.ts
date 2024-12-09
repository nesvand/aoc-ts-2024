// Advent of Code - Day 8
import { part1, part2 } from '.';

void (async () => {
    try {
        const input: string = await Bun.file('src/day08/resources/input.txt').text();

        console.log('--- Part One ---');
        console.log('Result', part1(input));

        console.log('--- Part Two ---');
        console.log('Result', part2(input));
    } catch (err) {
        console.error(err);
    }
})();
