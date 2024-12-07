// Advent of Code - Day 6 - Part Two

import os from 'node:os';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { Grid } from '@lib/grid';
import { testPath, DIRECTIONS } from "./part1";

export async function part2(input: string): Promise<number> {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));

    const grid = new Grid(items);
    const [initialPosition] = grid.find('^');
    const visited = new Set<string>([`${initialPosition.join(',')}`]);
    testPath(grid, initialPosition, DIRECTIONS[0], visited);
    const visitedPositions = Array.from(visited).map((pos) => pos.split(',').map(Number));

    const CPU_COUNT = os.cpus().length;
    const batches = Array(CPU_COUNT).fill(0).map(() => [] as Array<number[]>);

    for (let i = 0; i < visitedPositions.length; i++) {
        const point = visitedPositions[i];
        batches[i % CPU_COUNT].push(point);
    }

    const promises: Array<Promise<number>> = [];
    for (let i = 0; i < batches.length; i++) {
        const promise = new Promise<number>((resolve) => {
            const workerData = { input: input, batch: batches[i] };
            const worker = new Worker(path.join(__dirname, 'worker.ts'), { workerData });
            worker.on('message', (result: number) => {
                resolve(result);
            });
        });
        promises.push(promise);
    }

    return (await Promise.all(promises)).reduce((acc, val) => acc + val, 0);
}
