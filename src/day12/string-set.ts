// ============================================================================
// @aon/solver-helpers
// StringSet.ts
// ============================================================================

export class StringSet<T extends unknown & { toString(): string }> implements Set<T> {
    #map: Map<string, T>;

    constructor(iterable?: Iterable<T>) {
        this.#map = new Map([...(iterable ?? [])].map(t => [t.toString(), t]));
    }

    add(value: T) {
        this.#map.set(value.toString(), value);
        return this;
    }

    clear() {
        this.#map.clear();
    }

    delete(value: T) {
        return this.#map.delete(value.toString());
    }

    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
        for (const value of this.#map.values()) {
            callbackfn.bind(thisArg)(value, value, this);
        }
    }

    has(value: T): boolean {
        return this.#map.has(value.toString());
    }

    get size() {
        return this.#map.size;
    }

    entries() {
        return this.#iterableWrapper(true) as IterableIterator<[T, T]>;
    }

    keys() {
        return this.#iterableWrapper() as IterableIterator<T>;
    }

    values() {
        return this.#iterableWrapper() as IterableIterator<T>;
    }

    [Symbol.iterator]() {
        return this.#iterableWrapper() as IterableIterator<T>;
    }

    #iterableWrapper(entries?: boolean) {
        const it = this.#map.values();
        return {
            next() {
                const { value, done } = it.next();
                return entries ? { value: [value, value], done } : { value, done };
            },
            *[Symbol.iterator]() {
                for (const value of it) {
                    yield entries ? [value, value] : value;
                }
            },
        };
    }

    get [Symbol.toStringTag]() {
        return new Set([...this.#map.values()]).toString();
    }
}
