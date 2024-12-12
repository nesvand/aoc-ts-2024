import { describe, expect, jest, test, spyOn } from 'bun:test';
import { memoize, memoizeRecursive, asyncTimes, invert, isDefined, mapGetOrCreate, times, wait } from '@lib/general';

describe('@lib/utils/general', () => {
    describe('isDefined', () => {
        test('only considers `undefined` and `null` to be false', () => {
            const vals = [undefined, null, '', 0, false, true, 'test', 1, {}, []];
            const expected = [false, false, true, true, true, true, true, true, true, true];
            const actual = vals.map((val) => isDefined(val));
            expect(actual).toEqual(expected);
        });
    });

    describe('wait', () => {
        test('waits for the specified amount of time', async () => {
            const startTime = Date.now();
            await wait(1000);
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
        });
    });

    describe('times', () => {
        test('calls the function the specified number of times', () => {
            const fn = jest.fn();
            const results = times(5, fn);
            expect(fn).toHaveBeenCalledTimes(5);
            expect(results.length).toBe(5);
        });
    });

    describe('asyncTimes', () => {
        test('calls the function the specified number of times sequentially', async () => {
            const fn = jest.fn();
            const order: number[] = [];
            const mockFn = async (i: number) => {
                await wait(100);
                order.push(i);
                fn();
            };
            await asyncTimes(3, () => mockFn(order.length));
            expect(fn).toHaveBeenCalledTimes(3);
            expect(order).toEqual([0, 1, 2]); // Ensures sequential execution
        });

        test('calls the function in parallel when specified', async () => {
            const fn = jest.fn();
            const startTimes: number[] = [];
            const mockFn = async () => {
                startTimes.push(Date.now());
                await wait(100);
                fn();
            };
            await asyncTimes(3, mockFn, true);
            expect(fn).toHaveBeenCalledTimes(3);
            // All functions should start within a small time window
            const timeSpread = Math.max(...startTimes) - Math.min(...startTimes);
            expect(timeSpread).toBeLessThan(50);
        });
    });

    describe('mapGetOrCreate', () => {
        test('should not throw an error on falsy values', () => {
            const map = new Map<string, unknown>();
            const expected = [0, false, null, '', Number.NaN];
            const actual = ['test', 'test2', 'test3', 'test4', 'test5'].map((key, i) =>
                mapGetOrCreate(map, key, () => expected[i]),
            );
            expect(actual).toEqual(expected);
        });

        test('should store undefined values in the map', () => {
            const map = new Map<string, unknown>();
            const value = mapGetOrCreate(map, 'test', () => undefined);
            expect(value).toBeUndefined();
            expect(map.get('test')).toBeUndefined();
            expect(map.has('test')).toBe(true);
        });
    });

    describe('invert', () => {
        test('should invert the keys and values of an object', () => {
            const map = {
                a: 'b',
                c: 'd',
            };
            const expected = {
                b: 'a',
                d: 'c',
            };
            const actual = invert(map);
            expect(actual).toEqual(expected);
        });

        test('should throw error on duplicate values', () => {
            const map = {
                a: 'b',
                c: 'b',
            };
            expect(() => invert(map)).toThrow('Cannot invert map with duplicate values');
        });

        test('should handle numeric values', () => {
            const map = {
                a: 1,
                b: 2,
            };
            const expected = {
                1: 'a',
                2: 'b',
            };
            const actual = invert(map);
            expect(actual).toEqual(expected);
        });
    });

    describe('memoize', () => {
        test('should cache and return the same result for repeated calls', () => {
            const mockFn = jest.fn((x: number) => x * 2);
            const memoizedFn = memoize(mockFn);

            // First call
            const result1 = memoizedFn(5);
            expect(result1).toBe(10);
            expect(mockFn).toHaveBeenCalledTimes(1);

            // Repeated call with same argument
            const result2 = memoizedFn(5);
            expect(result2).toBe(10);
            expect(mockFn).toHaveBeenCalledTimes(1); // Function should not be called again
        });

        test('should work with different argument types', () => {
            const mockFn = jest.fn((x: string, y: number) => x.repeat(y));
            const memoizedFn = memoize(mockFn);

            const result1 = memoizedFn('a', 3);
            const result2 = memoizedFn('a', 3);
            expect(result1).toBe('aaa');
            expect(result2).toBe('aaa');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should respect maxSize option', () => {
            const mockFn = jest.fn((x: number) => x * 2);
            const memoizedFn = memoize(mockFn, { maxSize: 2 });

            // Fill cache
            memoizedFn(1);
            memoizedFn(2);
            expect(mockFn).toHaveBeenCalledTimes(2);

            // Retrieve cached values
            memoizedFn(1);
            memoizedFn(2);
            expect(mockFn).toHaveBeenCalledTimes(2);

            // Add third value, which should evict the oldest
            memoizedFn(3);
            expect(mockFn).toHaveBeenCalledTimes(3);

            // First cached value should now be recomputed
            memoizedFn(1);
            expect(mockFn).toHaveBeenCalledTimes(4);
        });

        test('should work with custom resolver', () => {
            const mockFn = jest.fn((x: number, y: number) => x + y);
            const memoizedFn = memoize(mockFn, {
                resolver: (x, y) => JSON.stringify([x, y].sort()), // Sort arguments to treat (1,2) same as (2,1)
            });

            const result1 = memoizedFn(1, 2);
            const result2 = memoizedFn(2, 1);
            expect(result1).toBe(3);
            expect(result2).toBe(3);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should handle complex objects', () => {
            const mockFn = jest.fn((obj: { a: number; b: string }) => obj.a + obj.b);
            const memoizedFn = memoize(mockFn);

            const obj1 = { a: 1, b: 'test' };
            const obj2 = { a: 1, b: 'test' };

            const result1 = memoizedFn(obj1);
            const result2 = memoizedFn(obj2);
            expect(result1).toBe('1test');
            expect(result2).toBe('1test');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('memoizeRecursive', () => {
        test('should memoize recursive fibonacci', () => {
            const mockFn = jest.fn((memo: (n: number) => number, n: number): number => {
                if (n <= 1) return n;
                return memo(n - 1) + memo(n - 2);
            });
            const fibonacci = memoizeRecursive(mockFn);

            // First calculation of fib(5)
            const result1 = fibonacci(5);
            expect(result1).toBe(5);
            expect(mockFn).toHaveBeenCalledTimes(6);

            // Second calculation should use memoized results
            const result2 = fibonacci(5);
            expect(result2).toBe(5);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should handle different argument combinations', () => {
            const complexRecursive = memoizeRecursive(
                (memo: (a: number, b: string) => string, a: number, b: string) => {
                    if (a <= 0) return b;
                    return memo(a - 1, b + a.toString());
                },
            );

            const result1 = complexRecursive(3, 'x');
            const result2 = complexRecursive(3, 'x');
            expect(result1).toBe('x321');
            expect(result2).toBe('x321');
        });

        test('should work with multiple recursive calls', () => {
            const factorial = memoizeRecursive((memo: (n: number) => number, n: number): number => {
                if (n <= 1) return 1;
                return n * memo(n - 1);
            });

            const results = [factorial(5), factorial(5), factorial(4), factorial(4)];
            expect(results).toEqual([120, 120, 24, 24]);
        });
    });
});
