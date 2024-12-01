export const sort = (values: number[]) => values.sort((a, b) => a - b);

export const sortby = <T>(values: T[], by: (v: T) => number) => values.sort((a, b) => by(a) - by(b));

export const sum = (a: number[]) => a.reduce((sum, n) => sum + n, 0);

export const product = (a: number[]) => a.reduce((p, n) => p * n, 1);

export const max = (a: number[]) => a.reduce((max, n) => Math.max(max, n), Number.NEGATIVE_INFINITY);

export const isArray = (values: unknown): values is unknown[] => Array.isArray(values);

export const lastIndex = <T>(arr: T[]): number => arr.length - 1;

export const lastItem = <T>(arr: T[]): T | undefined => arr[lastIndex(arr)];

export const lastItems = <T>(arr: T[], n: number): T[] => arr.slice(-n);

export const asNumbers = <T>(arr: T[]): number[] => arr.map((v) => Number(v));

export const from = <T = undefined>(size: number, creator?: (v: T, k: number) => T): T[] => {
    return Array.from({ length: size }, creator ?? (() => undefined as unknown as T));
};

export const zip = <T>(arr1: T[], arr2: T[]): Array<[T | undefined, T | undefined]> => {
    const maxLength = Math.max(arr1.length, arr2.length);

    return from(maxLength, (_, i) => [arr1[i], arr2[i]]);
};

export const splitOn = <T>(arr: T[], predicate: (v: T, i: number) => boolean): T[][] => {
    return arr.reduce<T[][]>(
        (chunks, item, i) => {
            if (predicate(item, i)) {
                chunks.push([]);
            } else {
                const currentChunkIndex = chunks.length - 1;
                chunks[currentChunkIndex]?.push(item);
            }
            return chunks;
        },
        [[]],
    );
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
    return arr.reduce<T[][]>((chunks, item) => {
        const currentChunk = lastItem(chunks);

        if (isArray(currentChunk) && currentChunk.length < size) {
            currentChunk.push(item);
        } else {
            chunks.push([item]);
        }

        return chunks;
    }, []);
};

/**
 * Creates a proxy that tracks array mutations
 */
function createArrayProxy<T>(array: T[], onChange: () => void): T[] {
    return new Proxy(array, {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            onChange();
            return result;
        },
        deleteProperty(target, property) {
            const result = Reflect.deleteProperty(target, property);
            onChange();
            return result;
        },
    });
}

/**
 * An iterator that efficiently generates sliding windows over an array.
 * Supports caching, change detection, and iterator reuse.
 *
 * @example
 * // Basic iterator usage
 * const iterator = new RollingWindowIterator([1, 2, 3, 4], 2);
 * for (const window of iterator) {
 *   console.log(window); // [1, 2], [2, 3], [3, 4]
 * }
 *
 * // With caching
 * iterator.cacheAll();
 * const windows = [...iterator]; // Uses cached windows
 *
 * // Change detection
 * const watchedArray = iterator.getArray();
 * watchedArray[0] = 10; // Automatically invalidates cache
 *
 * // Reusing the iterator
 * iterator.reset([5, 6, 7], 2); // New array and/or window size
 * const newWindows = [...iterator];
 */
export class RollingWindowIterator<T> implements IterableIterator<T[]> {
    private currentIndex = 0;
    private array: T[];
    private windowSize: number;
    private cache: T[][] | null = null;
    private isDirty = false;
    private proxyArray: T[];

    constructor(array: T[], windowSize: number) {
        this.proxyArray = createArrayProxy(array, () => {
            this.isDirty = true;
        });
        this.array = array;
        this.windowSize = windowSize;
    }

    /**
     * Resets the iterator with a new array and/or window size.
     * Clears the cache and resets the iteration state.
     */
    public reset(array?: T[], windowSize?: number): this {
        if (array) {
            this.proxyArray = createArrayProxy(array, () => {
                this.isDirty = true;
            });
            this.array = array;
        }
        if (windowSize !== undefined) {
            this.windowSize = windowSize;
        }
        this.clearCache();
        this.currentIndex = 0;
        return this;
    }

    [Symbol.iterator](): IterableIterator<T[]> {
        this.currentIndex = 0;
        return this;
    }

    private generateAllWindows(): T[][] {
        const windows: T[][] = [];
        let index = 0;

        while (index <= this.array.length - this.windowSize) {
            windows.push(this.array.slice(index, index + this.windowSize));
            index++;
        }

        this.isDirty = false;
        this.currentIndex = 0;
        return windows;
    }

    /**
     * Returns the proxied array that will trigger cache invalidation when modified
     */
    public getArray(): T[] {
        return this.proxyArray;
    }

    /**
     * Caches all windows for faster subsequent iterations.
     * Returns the cached windows.
     */
    public cacheAll(): T[][] {
        this.cache = this.generateAllWindows();
        return this.cache;
    }

    /**
     * Clears the cache, forcing windows to be regenerated on next iteration
     */
    public clearCache(): void {
        this.cache = null;
        this.isDirty = true;
    }

    next(): IteratorResult<T[]> {
        // If we have a cache, use it
        if (this.cache) {
            // Check if array has changed
            if (this.isDirty) {
                this.cache = this.generateAllWindows();
            }

            if (this.currentIndex >= this.cache.length) {
                return { done: true, value: undefined };
            }

            const value = this.cache[this.currentIndex];
            if (!value) {
                return { done: true, value: undefined };
            }
            this.currentIndex++;
            return { done: false, value };
        }

        // No cache, generate windows on-the-fly
        if (this.currentIndex > this.array.length - this.windowSize) {
            return { done: true, value: undefined };
        }

        const window = this.array.slice(this.currentIndex, this.currentIndex + this.windowSize);
        this.currentIndex++;
        return { done: false, value: window };
    }
}

// Update the singleton instance declaration to use unknown type
const reusableIterator = new RollingWindowIterator<unknown>([], 0);

/**
 * Creates an iterator that yields sliding windows over an array.
 * This function reuses a single iterator instance for better performance.
 *
 * For advanced features like caching and change detection, create a
 * RollingWindowIterator instance directly.
 *
 * @example
 * // Basic usage
 * const windows = [...rollingWindow([1, 2, 3, 4], 2)];
 * // [[1, 2], [2, 3], [3, 4]]
 *
 * // Using in a for...of loop
 * for (const window of rollingWindow(array, 3)) {
 *     // Process each window
 * }
 *
 * // Advanced usage with direct iterator
 * const iterator = new RollingWindowIterator(array, 3);
 * const watchedArray = iterator.getArray();
 * iterator.cacheAll();
 *
 * // Modify array through proxy to trigger cache invalidation
 * watchedArray[0] = 42;
 *
 * @param arr - The input array to create windows from
 * @param size - The size of each window
 * @returns An iterator yielding arrays of size `size` containing consecutive elements
 *
 * Key features:
 * - Memory efficient: Only creates windows when needed
 * - Reusable: Uses a single iterator instance
 * - Supports caching via RollingWindowIterator
 * - Supports change detection via proxy array
 */
export const rollingWindow = <T>(arr: T[], size: number): IterableIterator<T[]> => {
    if (size <= 0 || arr.length < size) {
        return [][Symbol.iterator]();
    }
    return reusableIterator.reset(arr, size) as IterableIterator<T[]>;
};
