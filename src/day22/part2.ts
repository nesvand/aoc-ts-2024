// Advent of Code - Day 22 - Part Two

import { generateNextCode } from "./part1";

function getHashedIdx(buffer: Int16Array, bufferStartIdx: number) {
    let hashedIdx = 0;
    let base = 1;
    for (let i = 0; i < 4; ++i) {
        // +9 to avoid negative numbers (range is -9 to 9)
        hashedIdx += base * (buffer[(bufferStartIdx + i) & 3] + 9);
        // 19 possible values (-9 to 9)
        base *= 19;
    }

    return hashedIdx;
}

export function part2(input: string): number {
    const codes = input
        .trim().split('\n').map(Number);

    // One entry per possible combination of the previous 4 prices - 19 values, 4 prices = 19 ** 4
    const sequenceTotal = new Uint32Array(19 ** 4);

    // As we're checking against to see if the index has been seen, we can't initialise this to 0, so we use -1
    const sequenceSeenForCode = new Uint16Array(19 ** 4).fill(-1);

    // Ring buffer of previous 4 prices
    const prevSalePricesRingBuffer = new Int16Array(4);

    for (const [codeIdx, code] of codes.entries()) {
        let nextCode = code;

        // Sale price is the last digit of the code
        let prevSalePrice = nextCode % 10;

        let ringBufferIdx = 0;
        for (let i = 0; i < 2000; ++i) {
            nextCode = generateNextCode(nextCode);

            // Sale price is the last digit of the code
            const sellPrice = nextCode % 10;

            prevSalePricesRingBuffer[ringBufferIdx] = sellPrice - prevSalePrice;
            // Rotate index through the ring buffer
            ringBufferIdx = ++ringBufferIdx & 3;

            prevSalePrice = sellPrice;

            if (i >= 3) {
                // Gets a hashed index based on the previous 4 prices
                const hashedIdx = getHashedIdx(prevSalePricesRingBuffer, ringBufferIdx);

                if (sequenceSeenForCode[hashedIdx] !== codeIdx) {
                    sequenceTotal[hashedIdx] += sellPrice;

                    sequenceSeenForCode[hashedIdx] = codeIdx;
                }
            }
        }
    }

    return sequenceTotal.sort((a, b) => b - a)[0];
}
