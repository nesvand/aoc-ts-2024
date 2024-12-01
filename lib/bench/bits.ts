import { type TestCase, parseArgs, runBenchmark } from '@lib/bench';
import * as bits from '@lib/bits';
import { BitsBenchmarks } from './types';

// Test data with various sizes and patterns
const testData = {
    // Small hex string (16 bits)
    smallHex: 'FFFF',
    // Medium hex string (64 bits)
    mediumHex: 'FFFFFFFFFFFFFFFF',
    // Large hex string (256 bits)
    largeHex: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',

    // Pre-computed binary strings for different sizes
    smallBinary: '1'.repeat(16),
    mediumBinary: '1'.repeat(64),
    largeBinary: '1'.repeat(256),

    // Bit array
    bits: Array.from({ length: 64 }, () => 1 as bits.Bit),
};

const testCases: TestCase[] = [
    {
        name: BitsBenchmarks.HEX_TO_PADDED_BINARY_SMALL,
        fn: bits.hexToPaddedBinary,
        setup: () => testData.smallHex,
    },
    {
        name: BitsBenchmarks.HEX_TO_PADDED_BINARY_MEDIUM,
        fn: bits.hexToPaddedBinary,
        setup: () => testData.mediumHex,
    },
    {
        name: BitsBenchmarks.HEX_TO_PADDED_BINARY_LARGE,
        fn: bits.hexToPaddedBinary,
        setup: () => testData.largeHex,
    },

    // bitStringToNumber tests
    {
        name: BitsBenchmarks.BIT_STRING_TO_NUMBER_16,
        fn: bits.bitStringToNumber,
        setup: () => testData.smallBinary,
    },
    {
        name: BitsBenchmarks.BIT_STRING_TO_NUMBER_32,
        fn: bits.bitStringToNumber,
        setup: () => testData.mediumBinary.slice(0, 32),
    },
    {
        name: BitsBenchmarks.BIT_STRING_TO_NUMBER_53, // Max safe integer bits
        fn: bits.bitStringToNumber,
        setup: () => testData.mediumBinary.slice(0, 53),
    },

    // bitsToNumber tests
    {
        name: BitsBenchmarks.BITS_TO_NUMBER_16,
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 16),
    },
    {
        name: BitsBenchmarks.BITS_TO_NUMBER_32,
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 32),
    },
    {
        name: BitsBenchmarks.BITS_TO_NUMBER_53,
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 53),
    },

    // bitSubstring tests
    {
        name: BitsBenchmarks.BIT_SUBSTRING_SMALL,
        fn: (str: string) => bits.bitSubstring(str, 0, 8),
        setup: () => testData.smallBinary,
    },
    {
        name: BitsBenchmarks.BIT_SUBSTRING_MEDIUM,
        fn: (str: string) => bits.bitSubstring(str, 16, 32),
        setup: () => testData.mediumBinary,
    },
    {
        name: BitsBenchmarks.BIT_SUBSTRING_LARGE,
        fn: (str: string) => bits.bitSubstring(str, 64, 96),
        setup: () => testData.largeBinary,
    },
];

// Run the benchmark
const { functionName, options } = parseArgs(process.argv);
runBenchmark(functionName, testCases, options);
