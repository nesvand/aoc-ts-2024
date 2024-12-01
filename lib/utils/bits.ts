export const BITS = [1, 0] as const;
export type Bit = (typeof BITS)[number];

export const BIT_CHARS = ['1', '0'] as const;
export type BitChar = (typeof BIT_CHARS)[number];

const HEX_TO_BINARY: Record<string, string> = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    a: '1010',
    b: '1011',
    c: '1100',
    d: '1101',
    e: '1110',
    f: '1111',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
};

export const hexToPaddedBinary = (hex: string): string => {
    let result = '';
    for (let i = 0; i < hex.length; i++) {
        const binary = HEX_TO_BINARY[hex[i]];
        if (!binary) throw new Error(`Invalid hex character: ${hex[i]}`);
        result += binary;
    }
    return result;
};

export const bitStringToNumber = (bitString: string): number => {
    let result = 0;
    for (let i = 0; i < bitString.length; i++) {
        result = (result << 1) | (bitString[i] === '1' ? 1 : 0);
    }
    return result;
};

export const bitsToNumber = (bits: Bit[]): number => {
    let result = 0;
    for (let i = 0; i < bits.length; i++) {
        result = (result << 1) | bits[i];
    }
    return result;
};

export const bitSubstring = (bitString: string, start: number, end: number): number => {
    let result = 0;
    for (let i = start; i < end; i++) {
        result = (result << 1) | (bitString[i] === '1' ? 1 : 0);
    }
    return result;
};
