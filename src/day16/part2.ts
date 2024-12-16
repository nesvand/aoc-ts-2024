// Advent of Code - Day 16 - Part Two

import { MinHeapMap } from '@lib/min-heap-map';
import { directions, dirCount, type Seen, compareSeen } from './part1';
import { Grid } from '@lib/grid';
import { mod } from '@lib/math';

export function part2(input: string) {
    const items = input.trim().split('\n').map(x => x.split(''));
    const grid = new Grid(items);
    const [startX, startY] = grid.find('S')[0];
    const [endX, endY] = grid.find('E')[0];

    const seen: Array<null | [number, number[]]> = Array.from({ length: grid.width * grid.height * 4 }, () => null);
    const h = new MinHeapMap<Seen>([], 0, true, compareSeen, false);

    seen[startY * grid.width * 4 + startX + 1] = [0, []];
    h.push([0, startX, startY, 1]);

    let bestCost = Number.POSITIVE_INFINITY;

    while (h.size) {
        const [cost, x, y, directionIdx] = h.pop();

        const currentIdx = y * grid.width * 4 + x * 4 + directionIdx;

        if (x === endX && y === endY) {
            if (cost > bestCost) {
                break;
            }
            bestCost = cost;
        }

        for (const dir of [mod(directionIdx - 1, dirCount), mod(directionIdx + 1, dirCount)]) {
            const pIdx = y * grid.width * 4 + x * 4 + dir;
            const newCost = cost + 1000;

            if (seen[pIdx] && seen[pIdx][0] < newCost) continue;

            if (seen[pIdx] === null) {
                h.push([cost + 1000, x, y, dir]);
            }

            seen[pIdx] ||= [newCost, []];
            seen[pIdx][1].push(currentIdx);
        }

        const [dx, dy] = directions[directionIdx];
        const [newX, newY] = [dx + x, dy + y];
        const pIdx = newY * grid.width * 4 + newX * 4 + directionIdx;
        const newCost = cost + 1;

        if (items[newY][newX] === '#') continue;
        if (seen[pIdx] && seen[pIdx][0] < newCost) continue;

        //danger danger danger! we might have already marked something off, even though this is a better path
        if (seen[pIdx] && seen[pIdx][0] > newCost) seen[pIdx] = null;

        if (seen[pIdx] === null) {
            h.push([cost + 1, newX, newY, directionIdx]);
        }

        seen[pIdx] ||= [newCost, []];
        seen[pIdx][1].push(currentIdx);
    }

    const endIdx = endY * grid.width * 4 + endX * 4;
    let minEnding = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 4; ++i) {
        if (!seen[endIdx + i]) continue;
        // biome-ignore lint/style/noNonNullAssertion: We know it's not null
        minEnding = Math.min(minEnding, seen[endIdx]![0]);
    }

    const bestPathEligible = new Array(items.length * grid.width).fill(0);
    let count = 0;

    for (let i = 0; i < 4; ++i) {
        const cost = seen[endIdx + i]?.[0];
        if (cost === undefined) continue;
        if (cost === minEnding) {
            dfs(endIdx + i);
        }
    }

    function dfs(dpIdx: number) {
        const realIdx = Math.floor(dpIdx / 4);

        if (!bestPathEligible[realIdx]) { ++count; }
        bestPathEligible[realIdx] = true;

        // biome-ignore lint/style/noNonNullAssertion: We know it's not null
        const toCheck = seen[dpIdx]![1];
        // biome-ignore lint/style/noNonNullAssertion: We know it's not null
        seen[dpIdx]![1] = [];
        for (const inIdx of toCheck) {
            dfs(inIdx);
        }
    }

    return count;
}
