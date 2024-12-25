// Advent of Code - Day 25 - Part One

import { Grid } from "@lib/grid";

function inputToData(input: string): [Array<[number, number, number, number, number]>, Array<[number, number, number, number, number]>] {
    const items = input
        .trim()
        .split('\n\n');
    return items.reduce(
        (acc, lines) => {
            const [ks, ls] = acc;
            const g = new Grid(lines.split('\n').map((line) => line.split('')));
            const keyOrLock: [number, number, number, number, number] = [0, 0, 0, 0, 0];
            if (g.get(0, 0) === '#') {
                for (let x = 0; x < g.width; x++) {
                    for (let y = 1; y < g.height - 1; y++) {
                        if (g.get(x, y) === '#') keyOrLock[x] = y;
                    }
                }
                ls.push(keyOrLock);
            } else {
                for (let x = 0; x < g.width; x++) {
                    for (let y = g.height - 2; y >= 1; y--) {
                        if (g.get(x, y) === '#') keyOrLock[x] = g.height - y - 1;
                    }
                }
                ks.push(keyOrLock);
            }

            return acc;
        },
        [[], []] as [Array<[number, number, number, number, number]>, Array<[number, number, number, number, number]>],
    );
}

function addKeyToLock(lock: [number, number, number, number, number], key: [number, number, number, number, number]) {
    const [l1, l2, l3, l4, l5] = lock;
    const [k1, k2, k3, k4, k5] = key;
    return [l1 + k1, l2 + k2, l3 + k3, l4 + k4, l5 + k5];
}

export function part1(input: string): number {
    const [keys, locks] = inputToData(input);

    let fits = 0;
    for (const key of keys) {
        for (const lock of locks) {
            if (addKeyToLock(lock, key).every((v) => v <= 5)) fits++;
        }
    }

    return fits;
}
