import { describe, expect, test } from 'bun:test';
import { SegmentTree } from '@lib/data';

describe('SegmentTree', () => {
    test('should handle range sum queries', () => {
        const nums = [1, 3, 5, 7, 9, 11];
        const tree = new SegmentTree(nums, (a, b) => a + b, 0);

        expect(tree.queryRange(1, 3)).toBe(15); // 3 + 5 + 7
        expect(tree.queryRange(0, 2)).toBe(9); // 1 + 3 + 5
        expect(tree.queryRange(4, 5)).toBe(20); // 9 + 11
    });

    test('should handle range minimum queries', () => {
        const nums = [5, 2, 9, 1, 7, 6];
        const tree = new SegmentTree(nums, Math.min, Number.POSITIVE_INFINITY);

        expect(tree.queryRange(0, 2)).toBe(2); // min(5, 2, 9)
        expect(tree.queryRange(2, 4)).toBe(1); // min(9, 1, 7)
        expect(tree.queryRange(0, 5)).toBe(1); // min of all
    });

    test('should handle range maximum queries', () => {
        const nums = [5, 2, 9, 1, 7, 6];
        const tree = new SegmentTree(nums, Math.max, Number.NEGATIVE_INFINITY);

        expect(tree.queryRange(0, 2)).toBe(9); // max(5, 2, 9)
        expect(tree.queryRange(2, 4)).toBe(9); // max(9, 1, 7)
        expect(tree.queryRange(0, 5)).toBe(9); // max of all
    });

    test('should handle updates', () => {
        const nums = [1, 3, 5, 7, 9, 11];
        const tree = new SegmentTree(nums, (a, b) => a + b, 0);

        tree.update(2, 10);
        expect(tree.queryRange(1, 3)).toBe(20); // 3 + 10 + 7

        tree.update(1, 5);
        expect(tree.queryRange(1, 3)).toBe(22); // 5 + 10 + 7
    });

    test('should handle single element queries', () => {
        const nums = [1, 3, 5, 7, 9];
        const tree = new SegmentTree(nums, (a, b) => a + b, 0);

        expect(tree.queryRange(2, 2)).toBe(5);
        expect(tree.queryRange(4, 4)).toBe(9);
    });

    test('should throw for invalid ranges', () => {
        const nums = [1, 3, 5, 7, 9];
        const tree = new SegmentTree(nums, (a, b) => a + b, 0);

        expect(() => tree.queryRange(-1, 3)).toThrow();
        expect(() => tree.queryRange(0, 5)).toThrow();
        expect(() => tree.queryRange(3, 2)).toThrow();
    });

    test('should throw for invalid updates', () => {
        const nums = [1, 3, 5, 7, 9];
        const tree = new SegmentTree(nums, (a, b) => a + b, 0);

        expect(() => tree.update(-1, 10)).toThrow();
        expect(() => tree.update(5, 10)).toThrow();
    });

    test('should handle empty array', () => {
        const tree = new SegmentTree([], (a, b) => a + b, 0);
        expect(tree.getSize()).toBe(0);
    });

    test('should handle custom merge functions', () => {
        const nums = [1, 2, 3, 4, 5];
        const tree = new SegmentTree(nums, (a, b) => a * b, 1);

        expect(tree.queryRange(1, 3)).toBe(24); // 2 * 3 * 4
        tree.update(2, 6);
        expect(tree.queryRange(1, 3)).toBe(48); // 2 * 6 * 4
    });
});
