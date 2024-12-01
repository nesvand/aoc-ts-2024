import { describe, expect, test } from 'bun:test';
import { Heap, HeapAsync } from 'heap-js';

describe('heapjs', () => {
    describe('examples', () => {
        test('should create a min heap', () => {
            const minHeap = new Heap();
            minHeap.init([5, 18, 1]);
            minHeap.push(2);
            expect(minHeap.peek()).toBe(1);
            expect(minHeap.pop()).toBe(1);
            expect(minHeap.peek()).toBe(2);
        });

        test('should create a max heap', () => {
            const maxHeap = new Heap(Heap.maxComparator);
            maxHeap.init([5, 18, 1]);
            maxHeap.push(2);
            expect(maxHeap.peek()).toBe(18);
            expect(maxHeap.pop()).toBe(18);
            expect(maxHeap.peek()).toBe(5);
        });

        test('should create a min heap with custom comparator', () => {
            type CustomPriority = { priority: number };
            const minHeap = new Heap((a: CustomPriority, b: CustomPriority) => a.priority - b.priority);
            minHeap.init([{ priority: 5 }, { priority: 18 }, { priority: 1 }]);
            minHeap.push({ priority: 2 });
            expect(minHeap.peek()).toStrictEqual({ priority: 1 });
            expect(minHeap.pop()).toStrictEqual({ priority: 1 });
            expect(minHeap.peek()).toStrictEqual({ priority: 2 });
        });

        test('should be able to process async', async () => {
            type CustomPriority = { priority: number };
            const asyncHeap = new HeapAsync(async (a: CustomPriority, b: CustomPriority) => a.priority - b.priority);
            await asyncHeap.init([{ priority: 5 }, { priority: 18 }, { priority: 1 }]);
            await asyncHeap.push({ priority: 2 });
            expect(asyncHeap.peek()).toStrictEqual({ priority: 1 });
            expect(await asyncHeap.pop()).toStrictEqual({ priority: 1 });
            expect(asyncHeap.peek()).toStrictEqual({ priority: 2 });
        });
    });
});
