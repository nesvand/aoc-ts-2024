/**
 * A Binary Heap implementation that can be used as either min-heap or max-heap.
 * @template T The type of elements stored in the heap
 */
interface PositionTrackable {
    onPositionChange?: (position: number) => void;
}

export class BinaryHeap<T extends PositionTrackable> {
    private heap: T[];
    private compare: (a: T, b: T) => number;

    /**
     * Creates a new Binary Heap
     * @param compare - Comparison function that defines the heap property
     *                  Returns positive if a has higher priority than b
     *                  Returns negative if a has lower priority than b
     *                  Returns 0 if equal priority
     */
    constructor(compare: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compare;
    }

    /**
     * Adds an element to the heap
     */
    public push(value: T): number {
        const index = this.heap.length;

        this.heap.push(value);
        this.siftUp(index);

        return this.heap.indexOf(value); // Return actual final position after sifting
    }

    /**
     * Removes and returns the highest priority element
     */
    public pop(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const result = this.heap[0];

        // If this is the last element, just pop it
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        // Move last element to root and sift down
        // biome-ignore lint/style/noNonNullAssertion: We know the heap is not empty
        const last = this.heap.pop()!;
        this.heap[0] = last;
        this.siftDown(0);

        return result;
    }

    /**
     * Returns the highest priority element without removing it
     */
    public peek(): T | undefined {
        return this.heap[0];
    }

    /**
     * Returns the current size of the heap
     */
    public size(): number {
        return this.heap.length;
    }

    /**
     * Checks if the heap is empty
     */
    public isEmpty(): boolean {
        return this.heap.length === 0;
    }

    /**
     * Gets the internal array (for testing)
     */
    public toArray(): T[] {
        return [...this.heap];
    }

    private siftUp(index: number): void {
        let currentIndex = index;
        const value = this.heap[index];
        if (!value) {
            throw new Error('Value is undefined');
        }

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const parent = this.heap[parentIndex];
            if (!parent) {
                throw new Error('Parent is undefined');
            }

            if (this.compare(value, parent) <= 0) {
                break;
            }

            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    private siftDown(index: number): void {
        const size = this.heap.length;
        let currentIndex = index;
        const value = this.heap[index];
        if (!value) {
            throw new Error('Value is undefined');
        }

        while (true) {
            const leftChildIndex = 2 * currentIndex + 1;
            const rightChildIndex = 2 * currentIndex + 2;
            let maxIndex = currentIndex;

            if (leftChildIndex < size) {
                const leftChild = this.heap[leftChildIndex];
                if (!leftChild) {
                    throw new Error('Left child is undefined');
                }

                if (this.compare(leftChild, value) > 0) {
                    maxIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < size) {
                const rightChild = this.heap[rightChildIndex];
                if (!rightChild) {
                    throw new Error('Right child is undefined');
                }

                const maxValue = maxIndex === currentIndex ? value : this.heap[maxIndex];
                if (!maxValue) {
                    throw new Error('Max value is undefined');
                }

                if (this.compare(rightChild, maxValue) > 0) {
                    maxIndex = rightChildIndex;
                }
            }

            if (maxIndex === currentIndex) {
                break;
            }

            this.swap(currentIndex, maxIndex);
            currentIndex = maxIndex;
        }
    }

    private swap(i: number, j: number): void {
        const temp = this.heap[i];
        if (temp === undefined) {
            throw new Error('Temp is undefined');
        }

        const temp2 = this.heap[j];
        if (temp2 === undefined) {
            throw new Error('Temp2 is undefined');
        }

        this.heap[i] = temp2;
        this.heap[j] = temp;

        // Notify both items of their new positions
        if (this.heap[i].onPositionChange) this.heap[i].onPositionChange(i);
        if (this.heap[j].onPositionChange) this.heap[j].onPositionChange(j);
    }

    public get(index: number): T | undefined {
        return this.heap[index];
    }

    public update(index: number, value: T): void {
        if (index < 0 || index >= this.heap.length) {
            throw new Error('Index out of bounds');
        }

        const oldValue = this.heap[index];
        if (oldValue === undefined) {
            throw new Error('Old value is undefined');
        }

        this.heap[index] = value;

        const comparison = this.compare(value, oldValue);

        if (comparison > 0) {
            this.siftUp(index);
        } else {
            this.siftDown(index);
        }
    }

    private notifyPosition(item: T, position: number): void {
        item.onPositionChange?.(position);
    }
}
