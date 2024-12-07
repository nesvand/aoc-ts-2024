import { Grid } from "@lib/grid";
import { isMainThread, parentPort, workerData } from "node:worker_threads";
import { DIRECTIONS, testPath } from "./part1";

function run() {
    if (isMainThread) {
        throw new Error("This should not be run on the main thread");
    }

    const wd = workerData as { input: string; batch: Array<number[]>; };

    const items = wd.input
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));
    const grid = new Grid(items);
    const [initialPosition] = grid.find('^');

    let result = 0;

    for (const [x, y] of wd.batch) {
        // Skip the initial position
        if (x === initialPosition[0] && y === initialPosition[1]) continue;

        // Copying the grid value so we don't have to keep copying the entire grid
        const copy = items[y][x];
        items[y][x] = '#';

        // `testPath` returns true when it finds a loop
        if (testPath(grid, initialPosition, DIRECTIONS[0], new Set(), true)) result++;
        items[y][x] = copy;
    }

    parentPort?.postMessage(result);
}

run();
