// Advent of Code - Day 12 - Part Two

import { Queue } from '@lib/array-deque';
import { StringSet } from '@lib/string-set';

const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export function part2(input: string): number {
    const gardenMap = input.trim().split('\n').map(line => line.split(''));
    const plotted: Set<number[]> = new StringSet();

    const countCorners = (x: number, y: number): number =>
        [0, 1, 2, 3]
            .map(d => [directions[d], directions[(d + 1) % 4]])
            .map(([[dx1, dy1], [dx2, dy2]]) => [
                gardenMap[y][x],
                gardenMap[y + dy1]?.[x + dx1],
                gardenMap[y + dy2]?.[x + dx2],
                gardenMap[y + dy1 + dy2]?.[x + dx1 + dx2],
            ])
            .filter(([plant, left, right, mid]) => (left !== plant && right !== plant) || (left === plant && right === plant && mid !== plant))
            .length;

    const formRegion = (x: number, y: number): number => {
        if (plotted.has([x, y])) return 0;

        const plant = gardenMap[y][x];
        const plotQueue = new Queue<[number, number]>([[x, y]])
        let [area, perimeter, corners] = [1, 4, countCorners(x, y)];
        plotted.add([x, y]);
        while (plotQueue.size) {
            [x, y] = plotQueue.remove();
            // biome-ignore lint/complexity/noForEach: <explanation>
            directions
                .map(([dx, dy]) => [x + dx, y + dy])
                .filter(([x, y]) => gardenMap[y]?.[x] === plant)
                .forEach(([x, y]) => {
                    perimeter--;
                    if (!plotted.has([x, y])) {
                        area += 1;
                        perimeter += 4;
                        corners += countCorners(x, y);
                        plotQueue.add([x, y]);
                        plotted.add([x, y]);
                    }
                })
        }
        return area * corners;
    }

    return gardenMap.flatMap((row, y) => row.map((_, x) => formRegion(x, y))).reduce((a, b) => a + b, 0);
}
