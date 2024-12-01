import { describe, expect, test } from 'bun:test';
import { DisjointSet } from '@lib/data';

describe('DisjointSet', () => {
    test('should initialize with separate sets', () => {
        const ds = new DisjointSet(3);
        expect(ds.sets).toBe(3);
        expect(ds.connected(0, 1)).toBe(false);
        expect(ds.connected(1, 2)).toBe(false);
    });

    test('should union elements', () => {
        const ds = new DisjointSet(4);
        expect(ds.union(0, 1)).toBe(true);
        expect(ds.union(2, 3)).toBe(true);
        expect(ds.connected(0, 1)).toBe(true);
        expect(ds.connected(2, 3)).toBe(true);
        expect(ds.connected(1, 2)).toBe(false);
    });

    test('should handle transitive unions', () => {
        const ds = new DisjointSet(5);
        ds.union(0, 1);
        ds.union(1, 2);
        expect(ds.connected(0, 2)).toBe(true);
        expect(ds.sets).toBe(3);
    });

    test('should track number of sets', () => {
        const ds = new DisjointSet(4);
        expect(ds.sets).toBe(4);
        ds.union(0, 1);
        expect(ds.sets).toBe(3);
        ds.union(1, 2);
        expect(ds.sets).toBe(2);
        ds.union(2, 3);
        expect(ds.sets).toBe(1);
    });

    test('should handle redundant unions', () => {
        const ds = new DisjointSet(3);
        expect(ds.union(0, 1)).toBe(true);
        expect(ds.union(0, 1)).toBe(false);
        expect(ds.sets).toBe(2);
    });

    test('should get all elements in a set', () => {
        const ds = new DisjointSet(5);
        ds.union(0, 1);
        ds.union(1, 2);
        expect(ds.getSet(0).sort()).toEqual([0, 1, 2]);
        expect(ds.getSet(3).sort()).toEqual([3]);
    });

    test('should throw for out of bounds access', () => {
        const ds = new DisjointSet(3);
        expect(() => ds.find(-1)).toThrow();
        expect(() => ds.find(3)).toThrow();
        expect(() => ds.union(-1, 1)).toThrow();
        expect(() => ds.union(1, 3)).toThrow();
        expect(() => ds.connected(-1, 1)).toThrow();
        expect(() => ds.getSet(3)).toThrow();
    });

    test('should throw for negative size', () => {
        expect(() => new DisjointSet(-1)).toThrow();
    });

    test('should handle complex unions', () => {
        const ds = new DisjointSet(6);
        ds.union(0, 1);
        ds.union(2, 3);
        ds.union(4, 5);
        ds.union(1, 3);
        ds.union(3, 5);

        expect(ds.sets).toBe(1);
        expect(ds.connected(0, 5)).toBe(true);
        expect(ds.getSet(0).sort()).toEqual([0, 1, 2, 3, 4, 5]);
    });
});
