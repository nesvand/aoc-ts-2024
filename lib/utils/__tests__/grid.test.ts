import { describe, expect, it } from 'bun:test';
import { Grid } from '@lib/grid';

describe('@lib/utils/grid', () => {
    const grid = new Grid<number>([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);

    describe('iterate', () => {
        it('should iterate over all items in the grid', () => {
            const items = [...grid.iterate()];
            expect(items).toEqual([
                [0, 0, 1],
                [1, 0, 2],
                [2, 0, 3],
                [0, 1, 4],
                [1, 1, 5],
                [2, 1, 6],
                [0, 2, 7],
                [1, 2, 8],
                [2, 2, 9],
            ]);
        });
    });

    describe('find', () => {
        it('should find the coordinates of a given item', () => {
            const found = grid.find(5);
            expect(found).toEqual([[1, 1]]);
        });

        it('should return an empty array if the item is not found', () => {
            const found = grid.find(10);
            expect(found).toEqual([]);
        });
    });

    describe('get', () => {
        it('should return the item at the specified coordinates', () => {
            const item = grid.get(1, 1);
            expect(item).toEqual(5);
        });

        it('should return undefined for out-of-bounds coordinates', () => {
            const item = grid.get(3, 3);
            expect(item).toBeUndefined();
        });
    });

    describe('toString', () => {
        it('should return a string representation of the grid', () => {
            const str = grid.toString();
            expect(str).toEqual('123\n456\n789');
        });
    });
});
