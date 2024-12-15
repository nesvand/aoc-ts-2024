// Advent of Code - Day 15 - Part Two

import { Grid } from "@lib/grid";

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

function moveBox(grid: Grid<string>, [cx, cy]: [number, number], [dx, dy]: [number, number], test = false): boolean {
    const [lx, ly] = [cx + dx, cy + dy];
    const left = grid.get(lx, ly);
    const [rx, ry] = [lx + 1, ly];
    const right = grid.get(rx, ry);

    let canMove = false;
    if (left === '#' || right === '#') return false;
    if (left === '.' && right === '.') {
        canMove = true;
    } else if (dy === 0) {
        // Horizontal case
        if (dx === 1) {
            // Right
            switch (right) {
                case '.': {
                    canMove = true;
                    break;
                }
                case '[': {
                    canMove = moveBox(grid, [rx, ry], [dx, dy]);
                    break;
                }
                default: throw new Error(`Unexpected value: ${right}, current position: (${cx}, ${cy}), move: (${dx}, ${dy})`);
            }
        } else {
            // Left
            switch (left) {
                case '.': {
                    canMove = true;
                    break;
                }
                case ']': {
                    // Extra offset because we always check from the left-side of the box
                    canMove = moveBox(grid, [lx - 1, ly], [dx, dy]);
                    break;
                }
                default: throw new Error(`Unexpected value: ${left}, current position: (${cx}, ${cy}), move: (${dx}, ${dy})`);
            }
        }
    } else {
        // Vertical case
        const toCheck: Record<string, [number, number]> = {}; // De-dupes in the case of perfectly aligned boxes
        if (left === '[') {
            toCheck[[lx, ly].join(',')] = [lx, ly];
        } else if (left === ']') {
            // Extra offset because we always check from the left-side of the box
            toCheck[[lx - 1, ly].join(',')] = [lx - 1, ly];
        }
        if (right === '[') {
            toCheck[[rx, ry].join(',')] = [rx, ry];
        } else if (right === ']') {
            // Extra offset because we always check from the left-side of the box
            toCheck[[rx - 1, ry].join(',')] = [rx - 1, ry];
        }

        const gridCopy = grid.clone();
        const checks = Object.values(toCheck);

        // Test each possible move before moving everything
        canMove = true;
        for (const [x, y] of checks) {
            canMove = canMove && moveBox(gridCopy, [x, y], [dx, dy], true);
        }
        if (canMove) {
            for (const [x, y] of checks) {
                moveBox(grid, [x, y], [dx, dy]);
            }
        }
    }

    if (canMove) {
        grid.set(cx, cy, '.');
        grid.set(cx + 1, cy, '.');
        grid.set(lx, ly, '[');
        grid.set(rx, ry, ']');
    }

    return canMove;
}

function moveRobot(grid: Grid<string>, [cx, cy]: [number, number], [dx, dy]: [number, number]): [number, number] {
    const [nx, ny] = [cx + dx, cy + dy];
    const next = grid.get(nx, ny);

    let move = false;
    switch (next) {
        case '#': break;
        case '.': {
            move = true;
            break;
        }
        case '[': {
            move = moveBox(grid, [nx, ny], [dx, dy]);
            break;
        }
        case ']': {
            move = moveBox(grid, [nx - 1, ny], [dx, dy]);
            break;
        }
    }

    if (move) {
        if (!grid.set(nx, ny, '@')) throw new Error(`Failed to set value at (${nx}, ${ny})`);
        if (!grid.set(cx, cy, '.')) throw new Error(`Failed to set value at (${cx}, ${cy})`);
    }
    return move ? [nx, ny] : [cx, cy];
}

export function part2(input: string): number {
    const [gridString, moveString] = input.trim()
        .replaceAll('\r', '')
        .split('\n\n');
    const gridArr = gridString.replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.').split('\n').map((row) => row.split(''));
    const grid = new Grid(gridArr);
    let robot = grid.find('@')[0];
    const moves = moveString.replaceAll('\n', '').split('') as Array<'^' | '>' | 'v' | '<'>;
    for (const move of moves) {
        robot = moveRobot(grid, robot, directions[dirMap[move]]);
    }
    const boxes = grid.find('[');
    return boxes.reduce((sum, [x, y]) => sum + (x + 100 * y), 0);
}
