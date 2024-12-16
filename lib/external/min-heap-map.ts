/*
  MinHeapMap by https://github.com/borgbean
*/

export class MinHeapMap<T> {
    heap: T[];
    size: number;
    cmp: (a: T, b: T) => number;
    trackPositions: boolean;
    idxByElem: Map<T, number> = new Map();

    constructor(arr: T[], size: number, alreadyHeapified: boolean, cmp: (a: T, b: T) => number, trackPositions: boolean) {
        this.heap = arr;
        this.size = size;
        this.cmp = cmp;

        if (!alreadyHeapified) {
            this.#heapify();
        }

        this.trackPositions = trackPositions;
        if (trackPositions) {
            for (let i = 0; i < size; ++i) {
                this.idxByElem.set(arr[i], i);
            }
        }
    }

    has(val: T) {
        if (!this.trackPositions) { throw new Error('not tracking value positions...'); }
        return this.idxByElem.has(val);
    }

    decrease(oldVal: T, newVal: T) {
        if (this.cmp(newVal, oldVal) > 0) { throw new Error('improper use of decrease'); }
        if (!this.trackPositions) { throw new Error('not tracking value positions...'); }
        const idx = this.idxByElem.get(oldVal);
        if (idx === undefined) { throw new Error('old value not found...'); }
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;

        this.#pushUp(idx);
    }

    increase(oldVal: T, newVal: T) {
        if (this.cmp(newVal, oldVal) < 0) { throw new Error('improper use of decrease'); }
        if (!this.trackPositions) { throw new Error('not tracking value positions...'); }
        const idx = (this.idxByElem.get(oldVal));
        if (idx === undefined) { throw new Error('old value not found...'); }
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;

        this.#pushDown(idx);
    }

    peek() {
        if (this.size < 1) { throw new Error('out of bounds'); }

        return this.heap[0];
    }

    pop() {
        if (this.size < 1) { throw new Error('out of bounds'); }

        const ret = this.heap[0];
        if (this.trackPositions) { this.idxByElem.delete(ret); }

        this.size -= 1;
        if (this.size > 0) {
            this.heap[0] = this.heap[this.size];
            if (this.trackPositions) { this.idxByElem.set(this.heap[0], 0); }

            this.#pushDown(0);
        }

        return ret;
    }

    push(e: T) {
        if ((this.heap.length - 1) <= this.size) {
            this.heap.length = this.heap.length * 2;
        }
        if (this.trackPositions) {
            if (this.idxByElem.has(e)) { throw new Error('already had element...'); }
            this.idxByElem.set(e, this.size);
        }
        this.heap[this.size] = e;

        this.#pushUp(this.size);
        this.size += 1;
    }

    #swp(idx1: number, idx2: number) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
        if (this.trackPositions) {
            this.idxByElem.set(this.heap[idx1], idx1);
            this.idxByElem.set(this.heap[idx2], idx2);
        }
    }

    #pushUp(idx: number) {
        let _idx = idx;
        while (_idx > 0) {
            const p = Math.floor((_idx - 1) / 2);

            const cmp = this.cmp(this.heap[_idx], this.heap[p]);
            if (cmp < 0) {
                this.#swp(_idx, p);
                _idx = p;
            } else {
                break;
            }
        }
    }

    #pushDown(idx: number) {
        let _idx = idx;
        while (true) {
            const l = _idx * 2 + 1;
            const r = l + 1;

            if (l >= this.size) { break; }

            const cmpL = this.cmp(this.heap[_idx], this.heap[l]);
            let cmpR = -1;
            if (r < this.size) {
                cmpR = this.cmp(this.heap[_idx], this.heap[r])
            }

            if (cmpL > 0 && cmpR > 0) {
                const cmpBoth = this.cmp(this.heap[l], this.heap[r]);
                const next = cmpBoth < 0 ? l : r;
                this.#swp(_idx, next);
                _idx = next;
            } else if (cmpL > 0) {
                this.#swp(_idx, l);
                _idx = l;
            } else if (cmpR > 0) {
                this.#swp(_idx, r);
                _idx = r;
            } else {
                break;
            }
        }
    }

    #heapify() {
        for (let i = Math.floor(this.size / 2) - 1; i >= 0; --i) {
            this.#pushDown(i);
        }
    }
}

export default MinHeapMap;
