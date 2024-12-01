/**
 * A Disjoint Set (Union-Find) data structure that efficiently tracks sets of elements
 * and their relationships. Implements path compression and union by rank optimizations.
 *
 * Common uses:
 * - Finding connected components in graphs
 * - Detecting cycles in graphs
 * - Kruskal's Minimum Spanning Tree algorithm
 *
 * @example
 * ```typescript
 * const ds = new DisjointSet(5); // Creates sets for elements 0-4
 * ds.union(0, 1); // Joins sets containing 0 and 1
 * ds.union(2, 3); // Joins sets containing 2 and 3
 * console.log(ds.connected(0, 1)); // true
 * console.log(ds.connected(1, 2)); // false
 * ```
 */
export class DisjointSet {
    private parent: number[];
    private rank: number[];
    private readonly size: number;
    private _sets: number;

    /**
     * Creates a new Disjoint Set with n elements, each in their own set.
     * @param n - Number of elements (0 to n-1)
     * @throws {Error} If n is less than 0
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(3); // Creates sets for elements 0, 1, 2
     * ```
     */
    constructor(n: number) {
        if (n < 0) {
            throw new Error('Size must be non-negative');
        }
        this.size = n;
        this._sets = n;
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    /**
     * Finds the representative (root) of the set containing element x.
     * Implements path compression for O(α(n)) amortized time complexity.
     *
     * @param x - The element to find the set for
     * @returns The representative of the set
     * @throws {Error} If x is out of bounds
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(3);
     * ds.union(0, 1);
     * console.log(ds.find(0) === ds.find(1)); // true
     * ```
     */
    public find(x: number): number {
        if (x < 0 || x >= this.size) {
            throw new Error('Element out of bounds');
        }
        if (this.parent[x] !== x) {
            if (this.parent[x] === undefined) {
                throw new Error('Parent is undefined');
            }
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    /**
     * Unions the sets containing elements x and y.
     * Uses union by rank for O(α(n)) amortized time complexity.
     *
     * @param x - First element
     * @param y - Second element
     * @returns True if the elements were in different sets, false if they were already in the same set
     * @throws {Error} If either element is out of bounds
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(4);
     * ds.union(0, 1); // Returns true
     * ds.union(1, 2); // Returns true
     * ds.union(0, 1); // Returns false (already in same set)
     * ```
     */
    public union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return false;
        }

        // Union by rank
        if (this.rank[rootX] === undefined || this.rank[rootY] === undefined) {
            throw new Error('Rank is undefined');
        }
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }

        this._sets--;
        return true;
    }

    /**
     * Checks if two elements are in the same set.
     *
     * @param x - First element
     * @param y - Second element
     * @returns True if the elements are in the same set, false otherwise
     * @throws {Error} If either element is out of bounds
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(3);
     * ds.union(0, 1);
     * console.log(ds.connected(0, 1)); // true
     * console.log(ds.connected(1, 2)); // false
     * ```
     */
    public connected(x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }

    /**
     * Gets the number of disjoint sets.
     * @returns The current number of disjoint sets
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(3);
     * console.log(ds.sets); // 3
     * ds.union(0, 1);
     * console.log(ds.sets); // 2
     * ```
     */
    public get sets(): number {
        return this._sets;
    }

    /**
     * Gets all elements in the same set as x.
     *
     * @param x - The element whose set to find
     * @returns Array of elements in the same set as x
     * @throws {Error} If x is out of bounds
     *
     * @example
     * ```typescript
     * const ds = new DisjointSet(4);
     * ds.union(0, 1);
     * ds.union(1, 2);
     * console.log(ds.getSet(0)); // [0, 1, 2]
     * ```
     */
    public getSet(x: number): number[] {
        const root = this.find(x);
        const result: number[] = [];

        for (let i = 0; i < this.size; i++) {
            if (this.find(i) === root) {
                result.push(i);
            }
        }

        return result;
    }
}
