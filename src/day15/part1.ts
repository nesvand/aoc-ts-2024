// Advent of Code - Day 15 - Part One

import { Grid } from "@lib/grid";
import { X509Certificate } from "crypto";

const directions: Array<[number, number]> = [
    [0, -1], // up
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
];

const dirMap = {
    '^': 0,
    '>': 1,
    'v': 2,
    '<': 3,
};

export function moveBox(grid: Grid<string>, x: number, y: number, [dx, dy]: [number, number]): boolean {
    const [nx, ny] = [x + dx, y + dy];
    const next = grid.get(nx, ny);
    if (next === '#') return false;
    if (next === '.') {
        if (!grid.set(nx, ny, 'O')) throw new Error(`Failed to set value at (${nx}, ${ny})`);
        if (!grid.set(x, y, '.')) throw new Error(`Failed to set value at (${x}, ${y})`);
        return true;
    }
    if (next !== 'O') throw new Error(`Unexpected value: ${next}, current position: (${x}, ${y}), move: (${dx}, ${dy})`);

    if (moveBox(grid, nx, ny, [dx, dy])) {
        if (!grid.set(nx, ny, 'O')) throw new Error(`Failed to set value at (${nx}, ${ny})`);
        if (!grid.set(x, y, '.')) throw new Error(`Failed to set value at (${x}, ${y})`);
        return true;
    }
    return false;
}

export function part1(input: string): number {
    const [gridString, moveString] = input.trim()
        .replaceAll('\r', '')
        .split('\n\n');
    const gridArr = gridString.split('\n').map((row) => row.split(''));
    const grid = new Grid(gridArr);
    const robot = grid.find('@')[0];
    const moves = moveString.replaceAll('\n', '').split('') as Array<'^' | '>' | 'v' | '<'>;

    for (const move of moves) {
        const [dx, dy] = directions[dirMap[move]];
        const [x, y] = robot;
        const [nx, ny] = [x + dx, y + dy];
        const next = grid.get(nx, ny);
        // Hit a wall
        if (next === '#') continue;

        // Empty space
        if (next === '.') {
            if (!grid.set(nx, ny, '@')) throw new Error(`Failed to set value at (${nx}, ${ny})`);
            robot[0] += dx;
            robot[1] += dy;
            if (!grid.set(x, y, '.')) throw new Error(`Failed to set value at (${x}, ${y})`);
            continue;
        }

        if (next !== 'O') throw new Error(`Unexpected value: ${next}, robot: (${x}, ${y}), move: ${move}, direction: (${dx}, ${dy})`);

        if (moveBox(grid, nx, ny, [dx, dy])) {
            if (!grid.set(nx, ny, '@')) throw new Error(`Failed to set value at (${nx}, ${ny})`);
            robot[0] += dx;
            robot[1] += dy;
            if (!grid.set(x, y, '.')) throw new Error(`Failed to set value at (${x}, ${y})`);
        } else {
            // Can't move box
        }
        // console.log(grid.toString());
        // console.log();
    }
    const boxes = grid.find('O');
    return boxes.reduce((sum, [x, y]) => sum + (x + 100 * y), 0)
}
