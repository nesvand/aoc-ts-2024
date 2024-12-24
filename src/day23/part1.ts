// Advent of Code - Day 23 - Part One

export function takeNext<T>(set: Set<T>) {
    return set[Symbol.iterator]().next().value ?? null;
}

export class UndirectedGraph {
    #nodes = new Map<string, Set<string>>();

    addNode(l: string, r: string): void {
        let lbucket = this.#nodes.get(l);
        if (!lbucket) {
            lbucket = new Set<string>();
            this.#nodes.set(l, lbucket);
        }
        lbucket.add(r);

        let rbucket = this.#nodes.get(r);
        if (!rbucket) {
            rbucket = new Set<string>();
            this.#nodes.set(r, rbucket);
        }
        rbucket.add(l);
    }

    areConnected(l: string, r: string): boolean {
        return (this.#nodes.get(l)?.has(r) || this.#nodes.get(r)?.has(l)) ?? false;
    }

    connectedNodes(node: string): Set<string> {
        return this.#nodes.get(node) ?? new Set<string>();
    }

    nodes(): string[] {
        return [...this.#nodes.keys()];
    }

    *cliques() {
        yield* this.#bronKerbosch(new Set(), new Set(this.nodes()), new Set());
    }

    // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithim
    *#bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>): IterableIterator<Set<string>> {
        if (p.size === 0 && x.size === 0) {
            yield r;
            return;
        }

        const u = takeNext(p.union(x));
        if (u === null) throw new Error('No nodes left in p or x');

        for (const v of p.difference(this.connectedNodes(u))) {
            yield* this.#bronKerbosch(
                r.union(new Set([v])),
                p.intersection(this.connectedNodes(v)),
                x.intersection(this.connectedNodes(v)),
            );
            // biome-ignore lint/style/noParameterAssign: This is fine - we only use these values in this closure
            p = p.difference(new Set([v]));
            // biome-ignore lint/style/noParameterAssign: This is fine - we only use these values in this closure
            x = x.union(new Set([v]));
        }
    }
}

export function part1(input: string): number {
    const connections = input.trim().split('\n')
        .map((line) => line.split('-') as [string, string]);

    const g = new UndirectedGraph();
    for (const [a, b] of connections) {
        g.addNode(a, b);
    }

    const triplets = new Map<string, [string, string, string]>();
    for (const a of g.nodes()) {
        const connectedNodes = [...g.connectedNodes(a)];

        for (let i = 0; i < connectedNodes.length; i++) {
            for (let j = i + 1; j < connectedNodes.length; j++) {
                const [b, c] = [connectedNodes[i], connectedNodes[j]];
                // If none of the nodes start with 't' then we can skip checking this triplet
                if (![a, b, c].some((v) => v.startsWith('t'))) continue;

                if (g.areConnected(b, c)) {
                    const key = [a, b, c].sort().join(',');
                    triplets.set(key, [a, b, c]);
                }
            }
        }
    }

    return [...triplets.values()].length;
}
