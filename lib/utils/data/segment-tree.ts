/**
 * A Segment Tree data structure that supports range queries and updates.
 * Useful for efficiently performing range-based operations like sum, min, or max.
 *
 * @template T The type of elements stored in the tree
 *
 * @example
 * ```typescript
 * // Create a segment tree for range sum queries
 * const nums = [1, 3, 5, 7, 9, 11];
 * const tree = new SegmentTree(nums, (a, b) => a + b, 0);
 *
 * console.log(tree.queryRange(1, 3)); // Sum of range [1,3]: 15 (3+5+7)
 * tree.update(2, 10); // Update index 2 to value 10
 * console.log(tree.queryRange(1, 3)); // New sum: 20 (3+10+7)
 * ```
 */
export class SegmentTree {
    private tree: number[];
    private readonly size: number;
    private readonly mergeFn: (left: number, right: number) => number;
    private readonly identity: number;

    /**
     * Creates a new Segment Tree.
     * @param array - The input array to build the tree from
     * @param mergeFn - Function to merge two elements (e.g., sum, min, max)
     * @param identity - Identity element for the merge function (0 for sum, Infinity for min, -Infinity for max)
     *
     * @example
     * ```typescript
     * // Segment tree for range minimum queries
     * const tree = new SegmentTree([1,3,2,7,9,11], Math.min, Infinity);
     *
     * // Segment tree for range maximum queries
     * const maxTree = new SegmentTree([1,3,2,7,9,11], Math.max, -Infinity);
     * ```
     */
    constructor(array: number[], mergeFn: (left: number, right: number) => number, identity: number) {
        this.size = array.length;
        this.mergeFn = mergeFn;
        this.identity = identity;
        this.tree = new Array(4 * this.size).fill(identity);

        if (this.size > 0) {
            this.buildTree(array, 0, 0, this.size - 1);
        }
    }

    /**
     * Updates the value at a specific index.
     * @param index - The index to update
     * @param value - The new value
     * @throws {Error} If index is out of bounds
     *
     * @example
     * ```typescript
     * const tree = new SegmentTree([1,2,3,4], (a, b) => a + b, 0);
     * tree.update(2, 10); // Updates index 2 to value 10
     * ```
     */
    public update(index: number, value: number): void {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }
        this.updateTree(0, 0, this.size - 1, index, value);
    }

    /**
     * Queries the range [left, right] inclusive.
     * @param left - Start index of the range
     * @param right - End index of the range
     * @returns Result of the range query
     * @throws {Error} If range is invalid
     *
     * @example
     * ```typescript
     * const tree = new SegmentTree([1,2,3,4], (a, b) => a + b, 0);
     * console.log(tree.queryRange(1, 3)); // Sum of range [1,3]: 9 (2+3+4)
     * ```
     */
    public queryRange(left: number, right: number): number {
        if (left < 0 || right >= this.size || left > right) {
            throw new Error('Invalid range');
        }
        return this.query(0, 0, this.size - 1, left, right);
    }

    /**
     * Gets the original array size.
     * @returns The size of the original array
     */
    public getSize(): number {
        return this.size;
    }

    private buildTree(array: number[], node: number, start: number, end: number): number {
        if (start === end) {
            if (array[start] === undefined) {
                throw new Error('Array element is undefined');
            }
            // biome-ignore lint/style/noNonNullAssertion: We know the element exists
            this.tree[node] = array[start]!;
            return this.tree[node];
        }

        const mid = Math.floor((start + end) / 2);
        const leftResult = this.buildTree(array, 2 * node + 1, start, mid);
        const rightResult = this.buildTree(array, 2 * node + 2, mid + 1, end);
        this.tree[node] = this.mergeFn(leftResult, rightResult);

        return this.tree[node];
    }

    private updateTree(node: number, start: number, end: number, index: number, value: number): void {
        if (start === end) {
            this.tree[node] = value;
            return;
        }

        const mid = Math.floor((start + end) / 2);
        if (index <= mid) {
            this.updateTree(2 * node + 1, start, mid, index, value);
        } else {
            this.updateTree(2 * node + 2, mid + 1, end, index, value);
        }

        const leftResult = this.tree[2 * node + 1];
        if (leftResult === undefined) {
            throw new Error('Left child is undefined');
        }
        const rightResult = this.tree[2 * node + 2];
        if (rightResult === undefined) {
            throw new Error('Right child is undefined');
        }
        this.tree[node] = this.mergeFn(leftResult, rightResult);
    }

    private query(node: number, start: number, end: number, left: number, right: number): number {
        if (left > end || right < start) {
            return this.identity;
        }

        if (left <= start && right >= end) {
            if (this.tree[node] === undefined) {
                throw new Error('Node is undefined');
            }
            return this.tree[node];
        }

        const mid = Math.floor((start + end) / 2);
        const leftResult = this.query(2 * node + 1, start, mid, left, right);
        const rightResult = this.query(2 * node + 2, mid + 1, end, left, right);

        return this.mergeFn(leftResult, rightResult);
    }
}
