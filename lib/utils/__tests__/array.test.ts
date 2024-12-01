import { describe, expect, it } from 'bun:test';
import {
    RollingWindowIterator,
    asNumbers,
    chunk,
    from,
    isArray,
    lastIndex,
    lastItem,
    lastItems,
    max,
    product,
    rollingWindow,
    sort,
    sortby,
    splitOn,
    sum,
    zip,
} from '@lib/array';

describe('@lib/utils/array', () => {
    describe('sort', () => {
        it('should sort numbers', () => {
            expect(sort([3, 2, 1])).toEqual([1, 2, 3]);
        });
    });

    describe('sortby', () => {
        it('should sort by a number property', () => {
            expect(sortby([{ a: 3 }, { a: 2 }, { a: 1 }], (v) => v.a)).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
        });
    });

    describe('sum', () => {
        it('should sum numbers', () => {
            expect(sum([1, 2, 3])).toEqual(6);
        });
    });

    describe('product', () => {
        it('should multiply numbers', () => {
            expect(product([1, 2, 3])).toEqual(6);
        });
    });

    describe('max', () => {
        it('should find the max number', () => {
            expect(max([1, 2, 3])).toEqual(3);
        });
    });

    describe('isArray', () => {
        it('should return true for arrays', () => {
            expect(isArray([])).toEqual(true);
        });

        it('should return false for non-arrays', () => {
            expect(isArray(1)).toEqual(false);
        });
    });

    describe('lastIndex', () => {
        it('should return the last index', () => {
            expect(lastIndex([1, 2, 3])).toEqual(2);
        });
    });

    describe('lastItem', () => {
        it('should return the last item', () => {
            expect(lastItem([1, 2, 3])).toEqual(3);
        });
    });

    describe('lastItems', () => {
        it('should return the last n items', () => {
            expect(lastItems([1, 2, 3], 2)).toEqual([2, 3]);
        });
    });

    describe('asNumbers', () => {
        it('should convert to numbers', () => {
            expect(asNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);
        });
    });

    describe('from', () => {
        it('should create an array of the given size', () => {
            expect(from(3)).toEqual([undefined, undefined, undefined]);
        });

        it('should create an array of the given size with the given creator', () => {
            expect(from(3, () => 1)).toEqual([1, 1, 1]);
        });
    });

    describe('zip', () => {
        it('should zip two arrays', () => {
            expect(zip([1, 2, 3], [4, 5, 6])).toEqual([
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
        });
    });

    describe('splitOn', () => {
        it('should split an array on a value', () => {
            expect(splitOn([1, 2, 3, 4, 5], (v) => v === 3)).toEqual([
                [1, 2],
                [4, 5],
            ]);
        });
    });

    describe('chunk', () => {
        it('should chunk an array', () => {
            expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        });
    });

    describe('rollingWindow', () => {
        it('should create rolling windows of the specified size', () => {
            const result = [...rollingWindow([1, 2, 3, 4, 5], 2)];
            expect(result).toEqual([
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 5],
            ]);
        });

        it('should handle edge cases', () => {
            // Invalid window sizes
            expect([...rollingWindow([1, 2, 3], 0)]).toEqual([]);
            expect([...rollingWindow([1, 2, 3], 4)]).toEqual([]);

            // Single element window
            expect([...rollingWindow([1, 2, 3], 1)]).toEqual([[1], [2], [3]]);

            // Window size equals array length
            expect([...rollingWindow([1, 2, 3], 3)]).toEqual([[1, 2, 3]]);
        });

        it('should work with for...of loop', () => {
            const result: number[][] = [];
            for (const window of rollingWindow([1, 2, 3, 4], 2)) {
                result.push(window);
            }
            expect(result).toEqual([
                [1, 2],
                [2, 3],
                [3, 4],
            ]);
        });

        describe('caching behavior', () => {
            it('should cache windows and use them for subsequent iterations', () => {
                const array = [1, 2, 3, 4, 5];
                const iterator = new RollingWindowIterator(array, 2);

                const cached = iterator.cacheAll();
                expect(cached).toEqual([
                    [1, 2],
                    [2, 3],
                    [3, 4],
                    [4, 5],
                ]);

                // Should use cache on subsequent iterations
                const result = [...iterator];
                expect(result).toEqual(cached);
            });

            it('should detect array modifications through proxy', () => {
                const array = [1, 2, 3, 4];
                const iterator = new RollingWindowIterator(array, 2);
                const watchedArray = iterator.getArray();

                iterator.cacheAll();

                // Test value modification
                watchedArray[0] = 10;
                expect([...iterator]).toEqual([
                    [10, 2],
                    [2, 3],
                    [3, 4],
                ]);

                // Test array mutations
                watchedArray.push(5);
                expect([...iterator]).toEqual([
                    [10, 2],
                    [2, 3],
                    [3, 4],
                    [4, 5],
                ]);

                watchedArray.pop();
                expect([...iterator]).toEqual([
                    [10, 2],
                    [2, 3],
                    [3, 4],
                ]);
            });

            it('should allow manual cache control', () => {
                const array = [1, 2, 3, 4];
                const iterator = new RollingWindowIterator(array, 2);

                iterator.cacheAll();
                iterator.clearCache();

                // Should still work without cache
                const result = [...iterator];
                expect(result).toEqual([
                    [1, 2],
                    [2, 3],
                    [3, 4],
                ]);
            });
        });

        describe('iterator reuse', () => {
            it('should allow reusing iterator with new array', () => {
                const iterator = new RollingWindowIterator([1, 2, 3], 2);

                const firstResult = [...iterator];
                expect(firstResult).toEqual([
                    [1, 2],
                    [2, 3],
                ]);

                iterator.reset([4, 5, 6, 7]);
                const secondResult = [...iterator];
                expect(secondResult).toEqual([
                    [4, 5],
                    [5, 6],
                    [6, 7],
                ]);
            });

            it('should allow reusing iterator with new window size', () => {
                const iterator = new RollingWindowIterator([1, 2, 3, 4], 2);

                const firstResult = [...iterator];
                expect(firstResult).toEqual([
                    [1, 2],
                    [2, 3],
                    [3, 4],
                ]);

                iterator.reset(undefined, 3);
                const secondResult = [...iterator];
                expect(secondResult).toEqual([
                    [1, 2, 3],
                    [2, 3, 4],
                ]);
            });

            it('should maintain cache behavior after reset', () => {
                const iterator = new RollingWindowIterator([1, 2, 3], 2);
                iterator.cacheAll();

                const watchedArray = iterator.getArray();
                watchedArray[0] = 10;

                const firstResult = [...iterator];
                expect(firstResult).toEqual([
                    [10, 2],
                    [2, 3],
                ]);

                iterator.reset([4, 5, 6]);
                iterator.cacheAll();

                const newWatchedArray = iterator.getArray();
                newWatchedArray[0] = 40;

                const secondResult = [...iterator];
                expect(secondResult).toEqual([
                    [40, 5],
                    [5, 6],
                ]);
            });

            it('should reuse iterator in rollingWindow function', () => {
                const firstResult = [...rollingWindow([1, 2, 3], 2)];
                expect(firstResult).toEqual([
                    [1, 2],
                    [2, 3],
                ]);

                const secondResult = [...rollingWindow([4, 5, 6, 7], 3)];
                expect(secondResult).toEqual([
                    [4, 5, 6],
                    [5, 6, 7],
                ]);

                // Verify that multiple concurrent iterations work correctly
                const iter1 = [...rollingWindow([1, 2, 3], 2)];
                const iter2 = [...rollingWindow([4, 5, 6], 2)];
                expect(iter1).toEqual([
                    [1, 2],
                    [2, 3],
                ]);
                expect(iter2).toEqual([
                    [4, 5],
                    [5, 6],
                ]);
            });
        });
    });
});
