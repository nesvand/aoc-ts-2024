// Advent of Code - Day 18 - Part Two

import { Grid } from "@lib/grid";
import { runDjikstra } from "./part1";

export function part2(input: string, width = 71, height = 71, initialIndex = 1024): string {
    const incomingBytes = input.trim().split('\n').map(line => line.split(',').map(Number)) as Array<[number, number]>;
    const grid = Grid.from(width, height, () => 0);

    for (let i = 0; i < initialIndex; i++) {
        const [x, y] = incomingBytes[i];
        grid.set(x, y, 1);
    }

    // Binary search for the index of the first time the path is not found
    let leftPointer = initialIndex; // We know this is valid, so we can start here
    let rightPointer = incomingBytes.length;
    let solutionIndex = 0;
    while (leftPointer <= rightPointer) {
        const midIndex = Math.floor((leftPointer + rightPointer) / 2);
        if (runDjikstra(grid.clone(), incomingBytes, width, height, initialIndex, midIndex) !== -1) {
            solutionIndex = midIndex;
            leftPointer = midIndex + 1;
        } else {
            rightPointer = midIndex - 1;
        }
    }

    return incomingBytes[solutionIndex].join(',');
}
