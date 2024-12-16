import { Grid } from '@lib/grid';
import { mod } from '@lib/math';
import { MinHeapMap } from '@lib/min-heap-map';

export const directions = [
    [0, -1], // Up
    [1, 0], // Right
    [0, 1], // Down
    [-1, 0], // Left
]
export const dirCount = directions.length;

// [cost, x, y, direction (index)]
export type Seen = [number, number, number, number];

export function compareSeen(a: Seen, b: Seen) {
    return a[0] - b[0];
}

export function part1(input: string) {
    const items = input.trim().split('\n').map((line) => line.split(''));
    const grid = new Grid(items);
    const [startX, startY] = grid.find('S')[0];
    const [endX, endY] = grid.find('E')[0];

    /*
      We need to track multiple directions for each position, and each value can be represented by a single number
      so we can use a hash index (ie. same as indexing for a 2D array, but with the addition of the direction as an offset).
      
      This makes the array size: width * height * number of directions (4)
    */
    const seen = Array.from({ length: grid.width * grid.height * 4 }, () => false);

    /*
      Explain MinHeapMap
    */
    const h = new MinHeapMap<Seen>([], 0, true, compareSeen, false);

    // We start knowing that we're at the 'S' facing East with a cost of 1
    seen[startY * grid.width * 4 + startX + 1] = true;
    h.push([0, startX, startY, 1]);

    while (h.size) {
        const [cost, x, y, directionIdx] = h.pop();

        if (x === endX && y === endY) return cost;

        /*
          Add turns (left and right) to the heap if we've not seen them from this directions yet
        */
        for (const dIdx of [mod(directionIdx - 1, dirCount), mod(directionIdx + 1, dirCount)]) {
            const pIdx = y * grid.width * 4 + x * 4 + dIdx;

            if (seen[pIdx]) continue;

            seen[pIdx] = true;
            h.push([cost + 1000, x, y, dIdx]);
        }

        // Check forwards (assumption is we won't need to move backwards)
        const [dx, dy] = directions[directionIdx];
        const [newX, newY] = [dx + x, dy + y]
        const pIdx = newY * grid.width * 4 + newX * 4 + directionIdx;

        // If we're facing a wall or a path we've already seen, skip
        if (seen[pIdx] || grid.get(newX, newY) === '#') continue;

        seen[pIdx] = true;
        h.push([cost + 1, newX, newY, directionIdx]);
    }

    throw new Error('Unable to find path');
}
