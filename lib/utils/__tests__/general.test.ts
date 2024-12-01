import { describe, expect, jest, test } from 'bun:test';
import { asyncTimes, invert, isDefined, mapGetOrCreate, times, wait } from '@lib/general';

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
});
