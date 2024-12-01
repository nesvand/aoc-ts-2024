import { beforeEach, describe, expect, test } from 'bun:test';
import { RingBuffer } from '@lib/data';
describe('@lib/utils/data', () => {
    describe('RingBuffer', () => {
        let buffer: RingBuffer<number>;

        beforeEach(() => {
            buffer = new RingBuffer<number>(3);
        });

        test('should have a size', () => {
            expect(buffer.size).toBe(3);
        });

        test('should have a pointer', () => {
            expect(buffer.pointer).toBe(0);
        });

        test('should push items', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            buffer.push(4);
            expect(buffer.get(0)).toBe(4);
            expect(buffer.get(1)).toBe(2);
            expect(buffer.get(2)).toBe(3);
        });

        test('should get items', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            expect(buffer.get(0)).toBe(1);
            expect(buffer.get(1)).toBe(2);
            expect(buffer.get(2)).toBe(3);
        });

        test('should throw for invalid index', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            expect(() => buffer.get(3)).toThrow();
        });

        test('should peek at last inserted item', () => {
            expect(buffer.peek()).toBeUndefined();
            buffer.push(1);
            expect(buffer.peek()).toBe(1);
            buffer.push(2);
            expect(buffer.peek()).toBe(2);
        });

        test('should clear buffer', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.clear();
            expect(buffer.peek()).toBeUndefined();
            expect(buffer.pointer).toBe(0);
        });

        test('should clear and resize buffer', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.clear(5);
            expect(buffer.size).toBe(5);
            expect(buffer.capacity).toBe(5);
            expect(buffer.peek()).toBeUndefined();
        });

        test('should check if buffer is full', () => {
            expect(buffer.isFull).toBe(false);
            buffer.push(1);
            buffer.push(2);
            expect(buffer.isFull).toBe(false);
            buffer.push(3);
            expect(buffer.isFull).toBe(true);
        });

        test('should convert to array', () => {
            buffer.push(1);
            buffer.push(2);
            expect(buffer.toArray()).toEqual([1, 2]);
            buffer.push(3);
            buffer.push(4);
            expect(buffer.toArray()).toEqual([4, 2, 3]);
        });

        test('should be iterable', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            buffer.push(4);
            expect([...buffer]).toEqual([4, 2, 3]);
        });

        test('should throw when clearing with invalid size', () => {
            expect(() => buffer.clear(0)).toThrow('Buffer size must be greater than 0');
            expect(() => buffer.clear(-1)).toThrow('Buffer size must be greater than 0');
        });

        test('should handle pushing undefined', () => {
            // biome-ignore lint/suspicious/noExplicitAny: Any is used to test undefined
            expect(() => buffer.push(undefined as any)).toThrow('Cannot push undefined value to buffer');
        });

        test('should handle single-element buffer', () => {
            const singleBuffer = new RingBuffer<number>(1);
            singleBuffer.push(1);
            expect(singleBuffer.peek()).toBe(1);
            singleBuffer.push(2);
            expect(singleBuffer.peek()).toBe(2);
            expect(singleBuffer.toArray()).toEqual([2]);
            expect([...singleBuffer]).toEqual([2]);
        });

        test('should handle consecutive pushes without reads', () => {
            for (let i = 1; i <= 10; i++) {
                buffer.push(i);
            }
            expect(buffer.toArray()).toEqual([10, 8, 9]);
            expect([...buffer]).toEqual([10, 8, 9]);
        });

        test('should maintain correct state after many operations', () => {
            buffer.push(1);
            buffer.clear();
            buffer.push(2);
            buffer.push(3);
            expect(buffer.toArray()).toEqual([2, 3]);
            buffer.clear(2);
            buffer.push(4);
            expect(buffer.toArray()).toEqual([4]);
        });

        test('should handle buffer resize to smaller size', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            buffer.clear(2);
            buffer.push(4);
            buffer.push(5);
            expect(buffer.toArray()).toEqual([4, 5]);
        });
    });
});
