// Advent of Code - Day 8 - Part One

import { Grid } from "@lib/grid";

export function calcNodeLocationPairs(grid: Grid<string>): Record<string, Array<[[number, number], [number, number]]>> {
    const nodes = new Set<string>();
    for (const [, , char] of grid.iterate()) {
        if (char === '.') continue;
        nodes.add(char);
    }

    const nodeLocations: Record<string, Array<[number, number]>> = {};
    for (const char of nodes) {
        const foundChars = grid.find(char);
        nodeLocations[char] = foundChars;
    }

    const nodeLocationPairs: Record<string, Array<[[number, number], [number, number]]>> = {};
    for (const [char, locations] of Object.entries(nodeLocations)) {
        const pairs: Array<[[number, number], [number, number]]> = [];
        for (let i = 0; i < locations.length - 1; i++) {
            const current = locations[i];
            for (let j = i + 1; j < locations.length; j++) {
                const next = locations[j];
                pairs.push([current, next]);
            }
        }
        nodeLocationPairs[char] = pairs;
    }

    return nodeLocationPairs;
}

export function part1(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        .map((lines) => lines.split('').filter(Boolean));
    const grid = new Grid(items);
    const nodeLocationPairs = calcNodeLocationPairs(grid);

    for (const [, pairs] of Object.entries(nodeLocationPairs)) {
        for (const [current, next] of pairs) {
            const [x1, y1] = current;
            const [x2, y2] = next;
            const dx1 = x2 - x1;
            const dy1 = y2 - y1;
            const dx2 = x1 - x2;
            const dy2 = y1 - y2;
            const beyondNext = [x2 + dx1, y2 + dy1];
            const beyondCurrent = [x1 + dx2, y1 + dy2];
            grid.set(beyondNext[0], beyondNext[1], '#');
            grid.set(beyondCurrent[0], beyondCurrent[1], '#');
        }
    }
    const count = grid.find('#').length;
    return count;
}
