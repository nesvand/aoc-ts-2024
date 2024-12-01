import { describe, expect, test } from 'bun:test';
import { clamp, isNumber, lerp, lerpAngle, mapRange, mod } from '@lib/math';

describe('@lib/utils/math', () => {
    describe('isNumber', () => {
        test('should return true for numbers', () => {
            const testValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (const value of testValues) {
                expect(isNumber(value)).toBe(true);
            }
        });
    });

    describe('mod', () => {
        test('handles positive numbers', () => {
            const tests: Array<[number, number, number]> = [
                [0, 10, 0],
                [1, 10, 1],
                [2, 10, 2],
                [3, 10, 3],
                [4, 10, 4],
                [5, 10, 5],
                [6, 10, 6],
                [7, 10, 7],
                [8, 10, 8],
                [9, 10, 9],
            ];
            for (const [n, m, expected] of tests) {
                expect(mod(n, m)).toBe(expected);
            }
        });

        test('handles negative numbers', () => {
            const tests: Array<[number, number, number]> = [
                [-1, 10, 9],
                [-2, 10, 8],
                [-3, 10, 7],
                [-4, 10, 6],
                [-5, 10, 5],
                [-6, 10, 4],
                [-7, 10, 3],
                [-8, 10, 2],
                [-9, 10, 1],
                [-10, 10, 0],
            ];
            for (const [n, m, expected] of tests) {
                expect(mod(n, m)).toBe(expected);
            }
        });
    });

    describe('clamp', () => {
        test('should return the value if it is within the range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
        });

        test('should return the min value if the value is below the range', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
        });

        test('should return the max value if the value is above the range', () => {
            expect(clamp(15, 0, 10)).toBe(10);
        });
    });

    describe('lerp', () => {
        test('should return the start value if percent 0', () => {
            expect(lerp(0, 10, 0)).toBe(0);
        });

        test('should return the end value if percent 1', () => {
            expect(lerp(0, 10, 1)).toBe(10);
        });

        test('should return the correct value if percent is between 0 and 1', () => {
            expect(lerp(0, 10, 0.5)).toBe(5);
        });
    });

    describe('lerpAngle', () => {
        test('should return the start value if percent 0', () => {
            expect(lerpAngle(0, Math.PI, 0)).toBe(0);
        });

        test('should return the end value if percent 1', () => {
            expect(lerpAngle(0, Math.PI, 1)).toBe(Math.PI);
        });

        test('should return the correct value if percent is between 0 and 1', () => {
            expect(lerpAngle(0, Math.PI, 0.5)).toBe(Math.PI / 2);
        });

        test('should return the correct value if percent is greater than 1', () => {
            expect(lerpAngle(0, Math.PI, 1.5)).toBe(Math.PI / 2);
        });

        test('should return the correct value if percent is less than 0', () => {
            expect(lerpAngle(0, Math.PI, -0.5)).toBe(Math.PI / 2);
        });
    });

    describe('mapRange', () => {
        test('should return a value between the new min and max', () => {
            expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
        });

        test('should continue to correctly map values below the from range', () => {
            expect(mapRange(-5, 0, 10, 0, 100)).toBe(-50);
        });

        test('should continue to correctly map values above the from range', () => {
            expect(mapRange(15, 0, 10, 0, 100)).toBe(150);
        });

        test('it should invert the range if the from range is inverted', () => {
            expect(mapRange(2, 10, 0, 0, 100)).toBe(80);
        });

        test('it should invert the range if the to range is inverted', () => {
            expect(mapRange(2, 0, 10, 100, 0)).toBe(80);
        });

        test('it should invert the range if both ranges are inverted', () => {
            expect(mapRange(2, 10, 0, 100, 0)).toBe(20);
        });
    });
});
