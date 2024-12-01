/**
 * A fixed-size circular buffer that overwrites oldest elements when full.
 * Useful for scenarios where you need to maintain a fixed-size history or cache.
 *
 * @template T The type of elements stored in the buffer
 *
 * @example
 * ```typescript
 * const buffer = new RingBuffer<number>(3);
 * buffer.push(1);
 * buffer.push(2);
 * buffer.push(3);
 * buffer.push(4); // Overwrites 1
 * console.log([...buffer]); // [4, 2, 3]
 * ```
 */
export class RingBuffer<T> {
    private _buffer: T[];
    private _size: number;
    private _pointer: number;

    /**
     * Creates a new RingBuffer with the specified size.
     * @param size - The fixed size of the buffer
     * @throws {Error} If size is less than or equal to 0
     */
    constructor(size: number) {
        if (size <= 0) {
            throw new Error('Buffer size must be greater than 0');
        }
        this._buffer = new Array<T>(size);
        this._size = size;
        this._pointer = 0;
    }

    /**
     * Adds an item to the buffer. If the buffer is full,
     * overwrites the oldest element.
     * @param item - The item to add
     * @throws {Error} If item is undefined
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * buffer.push(2);
     * buffer.push(3); // Overwrites 1
     * ```
     */
    public push(item: T): void {
        if (item === undefined) {
            throw new Error('Cannot push undefined value to buffer');
        }
        this._buffer[this._pointer] = item;
        this._pointer = (this._pointer + 1) % this._size;
    }

    /**
     * Retrieves an item at the specified index.
     * @param index - The index of the item to retrieve
     * @returns The item at the specified index
     * @throws {Error} If index is out of bounds or no element exists at the index
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * console.log(buffer.get(0)); // 1
     * ```
     */
    public get(index: number): T {
        if (index < 0 || index >= this._size) {
            throw new Error('Index out of bounds');
        }
        const item = this._buffer[index];
        if (item === undefined) {
            throw new Error('No element at specified index');
        }
        return item;
    }

    /**
     * Returns the most recently added item without removing it.
     * @returns The most recent item or undefined if buffer is empty
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * console.log(buffer.peek()); // 1
     * ```
     */
    public peek(): T | undefined {
        const index = this._pointer === 0 ? this._size - 1 : this._pointer - 1;
        return this._buffer[index];
    }

    /**
     * Clears the buffer and optionally resizes it.
     * @param newSize - Optional new size for the buffer
     * @throws {Error} If newSize is less than or equal to 0
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * buffer.clear(); // Clears buffer
     * buffer.clear(3); // Clears and resizes to 3
     * ```
     */
    public clear(newSize?: number): void {
        if (newSize !== undefined) {
            if (newSize <= 0) {
                throw new Error('Buffer size must be greater than 0');
            }
            this._size = newSize;
        }
        this._buffer = new Array<T>(this._size);
        this._pointer = 0;
    }

    /**
     * Checks if the buffer is full.
     * @returns True if all slots in the buffer are filled, false otherwise
     */
    public get isFull(): boolean {
        let count = 0;
        for (let i = 0; i < this._size; i++) {
            if (this._buffer[i] !== undefined) count++;
        }
        return count === this._size;
    }

    /**
     * Converts the buffer contents to an array, maintaining the order of insertion.
     * @returns Array containing buffer elements in order
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * buffer.push(2);
     * console.log(buffer.toArray()); // [1, 2]
     * ```
     */
    public toArray(): T[] {
        if (!this.isFull) {
            const result = [];
            const start = this._pointer;
            for (let i = 0; i < this._size; i++) {
                const idx = (start + i) % this._size;
                const item = this._buffer[idx];
                if (item !== undefined) result.push(item);
            }
            return result;
        }
        const result = new Array<T>(this._size);
        const start = this._pointer === 0 ? this._pointer : (this._pointer - 1 + this._size) % this._size;
        for (let i = 0; i < this._size; i++) {
            const idx = (start + i) % this._size;
            result[i] = this._buffer[idx] as T;
        }
        return result;
    }

    /**
     * Makes the buffer iterable.
     * @returns An iterator over the buffer elements in order
     *
     * @example
     * ```typescript
     * const buffer = new RingBuffer<number>(2);
     * buffer.push(1);
     * buffer.push(2);
     * for (const item of buffer) {
     *   console.log(item); // 1, 2
     * }
     * ```
     */
    public *[Symbol.iterator](): Iterator<T> {
        if (!this.isFull) {
            for (let i = 0; i < this._pointer; i++) {
                if (this._buffer[i] !== undefined) yield this._buffer[i] as T;
            }
        } else {
            const start = this._pointer === 0 ? this._pointer : (this._pointer - 1 + this._size) % this._size;
            for (let i = 0; i < this._size; i++) {
                const idx = (start + i) % this._size;
                yield this._buffer[idx] as T;
            }
        }
    }

    /**
     * Gets the current size of the buffer.
     * @returns The size of the buffer
     */
    public get size(): number {
        return this._size;
    }

    /**
     * Gets the total capacity of the buffer.
     * @returns The capacity of the buffer
     */
    public get capacity(): number {
        return this._size;
    }

    /**
     * Gets the current write position in the buffer.
     * @returns The current pointer position
     */
    public get pointer(): number {
        return this._pointer;
    }
}
