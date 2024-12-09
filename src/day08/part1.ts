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
        for (const [a, b] of pairs) {
            const [x1, y1] = a;
            const [x2, y2] = b;
            const [nx1, ny1] = [2 * x2 - x1, 2 * y2 - y1];
            grid.set(nx1, ny1, '#');
            const [nx2, ny2] = [2 * x1 - x2, 2 * y1 - y2];
            grid.set(nx2, ny2, '#');
        }
    }
    const count = grid.find('#').length;
    return count;
}
