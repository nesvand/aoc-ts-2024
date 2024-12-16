// ============================================================================
// @aon/solver-helpers
// StringSet.ts
// extended by nesvand
// ============================================================================

export class StringSet<T extends unknown & { toString(): string }> implements Set<T> {
    #map: Map<string, T>;

    constructor(iterable?: Iterable<T>) {
        this.#map = new Map([...(iterable ?? [])].map(t => [t.toString(), t]));
    }

    union<U>(other: ReadonlySetLike<U>): Set<T | U> {
        throw new Error("Method not implemented.");
    }

    intersection<U>(other: ReadonlySetLike<U>): Set<T & U> {
        throw new Error("Method not implemented.");
    }

    difference<U>(other: ReadonlySetLike<U>): Set<T> {
        throw new Error("Method not implemented.");
    }

    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U> {
        throw new Error("Method not implemented.");
    }

    isSubsetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }

    isSupersetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }

    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
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
        // biome-ignore lint/complexity/noForEach: we'll allow it
        this.#map.forEach(val => callbackfn(val, val, this), thisArg);
    }

    has(value: T): boolean {
        return this.#map.has(value.toString());
    }

    get size() {
        return this.#map.size;
    }

    entries() {
        return this.#iterableWrapper(true) as SetIterator<[T, T]>;
    }

    keys() {
        return this.#iterableWrapper() as SetIterator<T>;
    }

    values() {
        return this.#iterableWrapper() as SetIterator<T>;
    }

    [Symbol.iterator]() {
        return this.#iterableWrapper() as SetIterator<T>;
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
