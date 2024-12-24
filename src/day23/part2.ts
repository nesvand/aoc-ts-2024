// Advent of Code - Day 23 - Part Two

import { UndirectedGraph } from "./part1";

export function part2(input: string): string {
    const connections = input.trim().split('\n')
        .map((line) => line.split('-') as [string, string]);

    const g = new UndirectedGraph();
    for (const [a, b] of connections) {
        g.addNode(a, b);
    }

    const biggest = [...g.cliques()].sort((a, b) => b.size - a.size)[0];
    return [...biggest].sort().join(',');
}
