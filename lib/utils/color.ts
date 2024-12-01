import * as math from '@lib/math';

const BYTE_SCALE = 255;
const BYTE_MASK = 0xff;
const INV_BYTE_SCALE = 1 / BYTE_SCALE;

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const lerpColor = (a: Color, b: Color, t: number): Color => {
    const r = math.lerp(a.r, b.r, t);
    const g = math.lerp(a.g, b.g, t);
    const bl = math.lerp(a.b, b.b, t);
    const a_ = math.lerp(a.a, b.a, t);
    return { r, g, b: bl, a: a_ };
};

export const colorToHex = (color: Color): number => {
    const r = Math.round(color.r * BYTE_SCALE);
    const g = Math.round(color.g * BYTE_SCALE);
    const b = Math.round(color.b * BYTE_SCALE);
    const a = Math.round(color.a * BYTE_SCALE);
    return a * (1 << 24) + ((r << 16) | (g << 8) | b);
};

export const hexToColor = (hex: number): Color => {
    const a = (hex >> 24) & BYTE_MASK;
    const r = (hex >> 16) & BYTE_MASK;
    const g = (hex >> 8) & BYTE_MASK;
    const b = hex & BYTE_MASK;
    return { r: r * INV_BYTE_SCALE, g: g * INV_BYTE_SCALE, b: b * INV_BYTE_SCALE, a: a * INV_BYTE_SCALE };
};

export const colorToRGBAString = (color: Color): string => {
    const r = Math.round(color.r * BYTE_SCALE);
    const g = Math.round(color.g * BYTE_SCALE);
    const b = Math.round(color.b * BYTE_SCALE);
    const a = Math.round(color.a * BYTE_SCALE);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const colorToRGBString = (color: Color): string => {
    const r = Math.round(color.r * BYTE_SCALE);
    const g = Math.round(color.g * BYTE_SCALE);
    const b = Math.round(color.b * BYTE_SCALE);
    return `rgb(${r}, ${g}, ${b})`;
};

export const colorToHexString = (color: Color): string => {
    const hex = colorToHex(color);
    return `#${hex.toString(16).slice(-6).padStart(6, '0')}`;
};

export const hexStringToColor = (hex: string): Color => {
    const removeHash = hex.replace('#', '');
    const hexWithAlpha = `ff${removeHash}`;
    const hexNumber = Number.parseInt(hexWithAlpha, 16);
    return hexToColor(hexNumber);
};
