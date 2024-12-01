import { describe, expect, test } from 'bun:test';
import { type Edge, Graph, alg } from '@dagrejs/graphlib';

describe('@dagrejs/graphlib', () => {
    describe('examples', () => {
        test('should work', () => {
            // Create a new directed graph
            const g = new Graph();

            // Add node "a" to the graph with no label
            g.setNode('a');

            g.hasNode('a');
            expect(g.hasNode('a')).toBe(true);

            // Add node "b" to the graph with a String label
            g.setNode('b', "b's value");

            // Get the label for node b
            g.node('b');
            expect(g.node('b')).toBe("b's value");

            // Add node "c" to the graph with an Object label
            g.setNode('c', { k: 123 });

            // What nodes are in the graph?
            g.nodes();
            expect(g.nodes()).toStrictEqual(['a', 'b', 'c']);

            // Add a directed edge from "a" to "b", but assign no label
            g.setEdge('a', 'b');

            // Add a directed edge from "c" to "d" with an Object label.
            // Since "d" did not exist prior to this call it is automatically
            // created with an undefined label.
            g.setEdge('c', 'd', { k: 456 });

            // What edges are in the graph?
            g.edges();
            expect(g.edges()).toStrictEqual([
                { v: 'a', w: 'b' },
                { v: 'c', w: 'd' },
            ]);

            // Which edges leave node "a"?
            g.outEdges('a');
            expect(g.outEdges('a')).toStrictEqual([{ v: 'a', w: 'b' }]);

            // Which edges enter and leave node "d"?
            g.nodeEdges('d');
            expect(g.nodeEdges('d')).toStrictEqual([{ v: 'c', w: 'd' }]);
        });

        type NonEmptyArray<T> = [T, ...T[]];

        test('implementing dijkstra with graphlib', () => {
            const g = new Graph();
            const start = 'start';
            const end = 'end';
            g.setEdge(start, 'a', { weight: 1 });
            g.setEdge(start, 'b', { weight: 2 });
            g.setEdge('a', 'c', { weight: 3 });
            g.setEdge('b', 'c', { weight: 4 });
            g.setEdge('b', 'd', { weight: 5 });
            g.setEdge('c', end, { weight: 6 });
            g.setEdge('d', end, { weight: 7 });

            const weight = (e: Edge) => g.edge(e)?.weight ?? 0;
            const paths = alg.dijkstra(g, start, weight);

            const pathToEnd: NonEmptyArray<string> = [end];
            let path = paths[end];
            while (path !== undefined && path.distance !== 0) {
                pathToEnd.unshift(path.predecessor);
                path = paths[path.predecessor];
            }

            expect(pathToEnd).toStrictEqual(['start', 'a', 'c', 'end']);
        });
    });
});
