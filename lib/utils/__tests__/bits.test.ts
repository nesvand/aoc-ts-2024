import { describe, expect, test } from 'bun:test';
import { type Bit, bitStringToNumber, bitSubstring, bitsToNumber, hexToPaddedBinary } from '@lib/bits';

describe('@lib/utils/bits', () => {
    describe('hexToPaddedBinary', () => {
        test('should convert hex to padded binary', () => {
            const testValues = [
                { hex: '0', binary: '0000' },
                { hex: '1', binary: '0001' },
                { hex: '2', binary: '0010' },
                { hex: '3', binary: '0011' },
                { hex: '4', binary: '0100' },
                { hex: '5', binary: '0101' },
                { hex: '6', binary: '0110' },
                { hex: '7', binary: '0111' },
                { hex: '8', binary: '1000' },
                { hex: '9', binary: '1001' },
                { hex: 'a', binary: '1010' },
                { hex: 'b', binary: '1011' },
                { hex: 'c', binary: '1100' },
                { hex: 'd', binary: '1101' },
                { hex: 'e', binary: '1110' },
                { hex: 'f', binary: '1111' },
                { hex: 'A', binary: '1010' },
                { hex: 'B', binary: '1011' },
                { hex: 'C', binary: '1100' },
                { hex: 'D', binary: '1101' },
                { hex: 'E', binary: '1110' },
                { hex: 'F', binary: '1111' },
            ];
            for (const { hex, binary } of testValues) {
                expect(hexToPaddedBinary(hex)).toBe(binary);
            }
        });
    });

    describe('bitStringToNumber', () => {
        test('should convert bit string to number', () => {
            const testValues = [
                { bits: '0000', number: 0 },
                { bits: '0001', number: 1 },
                { bits: '0010', number: 2 },
                { bits: '0011', number: 3 },
                { bits: '0100', number: 4 },
                { bits: '0101', number: 5 },
                { bits: '0110', number: 6 },
                { bits: '0111', number: 7 },
                { bits: '1000', number: 8 },
                { bits: '1001', number: 9 },
                { bits: '1010', number: 10 },
                { bits: '1011', number: 11 },
                { bits: '1100', number: 12 },
                { bits: '1101', number: 13 },
                { bits: '1110', number: 14 },
                { bits: '1111', number: 15 },
            ];
            for (const { bits, number } of testValues) {
                expect(bitStringToNumber(bits)).toBe(number);
            }
        });
    });

    describe('bitsToNumber', () => {
        test('should convert bits to number', () => {
            const testValues: Array<{ bits: Bit[]; number: number }> = [
                { bits: [0, 0, 0, 0], number: 0 },
                { bits: [0, 0, 0, 1], number: 1 },
                { bits: [0, 0, 1, 0], number: 2 },
                { bits: [0, 0, 1, 1], number: 3 },
                { bits: [0, 1, 0, 0], number: 4 },
                { bits: [0, 1, 0, 1], number: 5 },
                { bits: [0, 1, 1, 0], number: 6 },
                { bits: [0, 1, 1, 1], number: 7 },
                { bits: [1, 0, 0, 0], number: 8 },
                { bits: [1, 0, 0, 1], number: 9 },
                { bits: [1, 0, 1, 0], number: 10 },
                { bits: [1, 0, 1, 1], number: 11 },
                { bits: [1, 1, 0, 0], number: 12 },
                { bits: [1, 1, 0, 1], number: 13 },
                { bits: [1, 1, 1, 0], number: 14 },
                { bits: [1, 1, 1, 1], number: 15 },
            ];
            for (const { bits, number } of testValues) {
                expect(bitsToNumber(bits)).toBe(number);
            }
        });
    });

    describe('bitSubstring', () => {
        test('should convert bit string to number', () => {
            const testValues = [
                { bits: '0000', start: 2, end: 4, number: 0 },
                { bits: '0001', start: 2, end: 4, number: 1 },
                { bits: '0010', start: 2, end: 4, number: 2 },
                { bits: '0011', start: 2, end: 4, number: 3 },
                { bits: '0100', start: 2, end: 4, number: 0 },
                { bits: '0101', start: 2, end: 4, number: 1 },
                { bits: '0110', start: 2, end: 4, number: 2 },
                { bits: '0111', start: 2, end: 4, number: 3 },
                { bits: '1000', start: 2, end: 4, number: 0 },
                { bits: '1001', start: 2, end: 4, number: 1 },
                { bits: '1010', start: 2, end: 4, number: 2 },
                { bits: '1011', start: 2, end: 4, number: 3 },
                { bits: '1100', start: 2, end: 4, number: 0 },
                { bits: '1101', start: 2, end: 4, number: 1 },
                { bits: '1110', start: 2, end: 4, number: 2 },
                { bits: '1111', start: 2, end: 4, number: 3 },
            ];
            for (const { bits, start, end, number } of testValues) {
                expect(bitSubstring(bits, start, end)).toBe(number);
            }
        });
    });
});
