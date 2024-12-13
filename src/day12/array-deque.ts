// ============================================================================
// @aon/solver-helpers
// ArrayDeque.ts
// ============================================================================

class ArrayDeque<T> {
    #items: T[];
    #head: number;
    #tail: number;
    #size: number;

    protected reverseIter = false;

    constructor(items?: T[] | { toArray: () => T[] }) {
        let capacity = 16;
        const initialItems = Array.isArray(items) ? items : items?.toArray();

        while (capacity < (initialItems?.length ?? 0)) capacity *= 2;

        this.#items = Array<T>(capacity);
        initialItems?.forEach((item, index) => { this.#items[index] = item; });

        this.#head = 0;
        this.#tail = (initialItems?.length || capacity) - 1;
        this.#size = initialItems?.length || 0;
    }

    get size() {
        return this.#size;
    }

    clear() {
        this.#head = 0;
        this.#tail = this.#items.length - 1;
        this.#size = 0;
        return this;
    }

    toArray(): T[] {
        return (
            !this.size ? []
                : this.#head <= this.#tail ? [...this.#items.slice(this.#head, this.#tail + 1)]
                    : [...this.#items.slice(this.#head), ...this.#items.slice(0, this.#tail + 1)]
        );
    }

    toString() {
        const arr = this.toArray();
        const arrString = arr.length <= 8 ? arr.join() : `${arr.slice(0, 4).join()}…,${arr.slice(-3).join()}`;

        return `ArrayDeque(${this.size}) [${arrString}]`;
    }

    forEach(callbackfn: (item: T, index: number, object: typeof this) => void, thisArg?: unknown) {
        [...Array(this.#size)].forEach((_, i) => {
            const val = this.#items[(this.#head + i) % this.#items.length];
            thisArg ? callbackfn.bind(thisArg)(val, i, this) : callbackfn(val, i, this);
        });
    }

    [Symbol.iterator]() {
        const items = this.toArray();
        this.reverseIter && items.reverse();
        let i = 0;
        return {
            next() {
                const [value, done] = i < items.length ? [items[i], false] : [null, true];
                i++;
                return { value, done };
            },
            *[Symbol.iterator]() {
                for (const item of items) {
                    yield item;
                }
            },
        };
    }

    protected addFirst(item: T) {
        this.#ensureCapacity();
        this.#head = (this.#head + this.#items.length - 1) % this.#items.length;
        this.#items[this.#head] = item;
        this.#size++;
        return this;
    }

    protected addLast(item: T) {
        this.#ensureCapacity();
        this.#tail = (this.#tail + 1) % this.#items.length;
        this.#items[this.#tail] = item;
        this.#size++;
        return this;
    }

    protected removeFirst() {
        if (this.#size) {
            const item = this.#items[this.#head];
            this.#head = (this.#head + 1) % this.#items.length;
            this.#size--;
            return item;
        }
        return null;
    }

    protected removeLast() {
        if (this.#size) {
            const item = this.#items[this.#tail];
            this.#tail = (this.#tail + this.#items.length - 1) % this.#items.length;
            this.#size--;
            return item;
        }
        return null;
    }

    protected peekFirst() {
        return this.#size ? this.#items[this.#head] : null;
    }

    protected peekLast() {
        return this.#size ? this.#items[this.#tail] : null;
    }

    #ensureCapacity() {
        if (this.#size === this.#items.length) {
            const newItems = Array<T>(this.#items.length * 2);
            for (let i = 0; i < this.#size; i++) {
                newItems[i] = this.#items[(i + this.#head) % this.#size];
            }
            this.#items = newItems;
            this.#head = 0;
            this.#tail = this.#size - 1;
        }
    }
}

export class Stack<T> extends ArrayDeque<T> {
    protected reverseIter = true;

    push = super.addLast;
    pop = super.removeLast;
    peek = super.peekLast;
}

export class Queue<T> extends ArrayDeque<T> {
    add = super.addLast;
    remove = super.removeFirst;
    peek = super.peekFirst;
}

export class Deque<T> extends ArrayDeque<T> {
    addFirst = super.addFirst;
    addLast = super.addLast;
    removeFirst = super.removeFirst;
    removeLast = super.removeLast;
    peekFirst = super.peekFirst;
    peekLast = super.peekLast;
}
