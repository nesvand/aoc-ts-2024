import { describe, expect, test } from 'bun:test';
import {
    type Color,
    colorToHex,
    colorToHexString,
    colorToRGBAString,
    colorToRGBString,
    hexStringToColor,
    hexToColor,
    lerpColor,
} from '@lib/color';

describe('@lib/utils/color', () => {
    describe('lerpColor', () => {
        test('should lerp between two colors', () => {
            const a: Color = { r: 0, g: 0, b: 0, a: 1 };
            const b: Color = { r: 1, g: 1, b: 1, a: 1 };
            const c = lerpColor(a, b, 0.5);
            expect(c).toEqual({ r: 0.5, g: 0.5, b: 0.5, a: 1 });
        });

        test('should lerp between two colors with alpha', () => {
            const a: Color = { r: 0, g: 0, b: 0, a: 0 };
            const b: Color = { r: 1, g: 1, b: 1, a: 1 };
            const c = lerpColor(a, b, 0.5);
            expect(c).toEqual({ r: 0.5, g: 0.5, b: 0.5, a: 0.5 });
        });
    });

    describe('colorToHex', () => {
        test('should convert a color to a hex number', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
            const hex = colorToHex(c);
            expect(hex).toBe(0xff808080);
        });

        test('should convert a color to a hex number with alpha', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
            const hex = colorToHex(c);
            expect(hex).toBe(0x80808080);
        });
    });

    describe('hexToColor', () => {
        test('should convert a hex number to a color', () => {
            const c = hexToColor(0xff808080);
            expect(c.r).toBeCloseTo(0.5);
            expect(c.g).toBeCloseTo(0.5);
            expect(c.b).toBeCloseTo(0.5);
            expect(c.a).toBeCloseTo(1.0);
        });
    });

    describe('colorToRGBAString', () => {
        test('should convert a color to a rgba string', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
            const str = colorToRGBAString(c);
            expect(str).toBe('rgba(128, 128, 128, 255)');
        });

        test('should convert a color to a rgba string with alpha', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
            const str = colorToRGBAString(c);
            expect(str).toBe('rgba(128, 128, 128, 128)');
        });
    });

    describe('colorToRGBString', () => {
        test('should convert a color to a rgb string', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
            const str = colorToRGBString(c);
            expect(str).toBe('rgb(128, 128, 128)');
        });

        test('should convert a color to a rgb string with alpha', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 0.5 };
            const str = colorToRGBString(c);
            expect(str).toBe('rgb(128, 128, 128)');
        });
    });

    describe('colorToHexString', () => {
        test('should convert a color to a hex string', () => {
            const c: Color = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
            const str = colorToHexString(c);
            expect(str).toBe('#808080');
        });
    });

    describe('hexStringToColor', () => {
        test('should convert a hex string to a color', () => {
            const c = hexStringToColor('#808080');
            expect(c.r).toBeCloseTo(0.5);
            expect(c.g).toBeCloseTo(0.5);
            expect(c.b).toBeCloseTo(0.5);
            expect(c.a).toBeCloseTo(1.0);
        });
    });

    describe('compound conversions', () => {
        test('hex string -> color -> hex string should preserve value', () => {
            const original = '#808080';
            const color = hexStringToColor(original);
            const result = colorToHexString(color);
            expect(result).toBe(original);
        });

        test('color -> hex number -> color should preserve values', () => {
            const original: Color = { r: 0.5, g: 0.25, b: 0.75, a: 1 };
            const hex = colorToHex(original);
            const result = hexToColor(hex);
            expect(result.r).toBeCloseTo(original.r);
            expect(result.g).toBeCloseTo(original.g);
            expect(result.b).toBeCloseTo(original.b);
            expect(result.a).toBeCloseTo(original.a);
        });

        test('color -> rgba string -> hex -> color should preserve values', () => {
            const original: Color = { r: 0.5, g: 0.25, b: 0.75, a: 0.5 };
            const rgba = colorToRGBAString(original);
            expect(rgba).toBe('rgba(128, 64, 191, 128)');
            const hex = colorToHex(original);
            const result = hexToColor(hex);
            expect(result.r).toBeCloseTo(original.r);
            expect(result.g).toBeCloseTo(original.g);
            expect(result.b).toBeCloseTo(original.b);
            expect(result.a).toBeCloseTo(original.a);
        });
    });
});
