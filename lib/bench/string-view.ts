import { type TestCase, parseArgs, runBenchmark } from '@lib/bench';
import { StringView } from '@lib/string-view';
import { StringViewBenchmarks } from './types';

// Test data with various content types and sizes
const testData = {
    // ASCII only
    smallAscii: 'hello world',
    mediumAscii: 'hello world'.repeat(10),
    largeAscii: 'hello world'.repeat(100),

    // Mixed content (ASCII, emoji, CJK)
    smallMixed: 'Hello 👋 世界',
    mediumMixed: 'Hello 👋 世界 '.repeat(10),
    largeMixed: 'Hello 👋 世界 '.repeat(100),

    // Whitespace handling
    leadingWhitespace: '   \t\n\rHello',
    trailingWhitespace: 'Hello   \t\n\r',
    mixedWhitespace: '   Hello   World   ',

    // Numbers
    integers: '12345678901234567890',
    floats: '123.456.789',

    // Complex emoji sequences
    complexEmoji: '👨‍👩‍👧‍👦 👨🏻‍💻 🏳️‍🌈',

    // Number chopping
    mixedIntegers: '123 -456 +789 abc 101112',
    mixedFloats: '123.456 -789.012 +345.678 abc 901.234',
};

const testCases: TestCase[] = [
    {
        name: StringViewBenchmarks.CREATE_SMALL,
        fn: (str: string) => new StringView(str),
        setup: () => testData.smallAscii,
    },
    {
        name: StringViewBenchmarks.CREATE_LARGE,
        fn: (str: string) => new StringView(str),
        setup: () => testData.largeAscii,
    },

    // Basic operations
    {
        name: 'charAt-ascii',
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) sv.charAt(i);
        },
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: 'charAt-unicode',
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) sv.charAt(i);
        },
        setup: () => new StringView(testData.mediumMixed),
    },

    // Iteration
    {
        name: 'iterate-ascii',
        fn: (sv: StringView) => {
            for (const _ of sv) {
                /* noop */
            }
        },
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: 'iterate-unicode',
        fn: (sv: StringView) => {
            for (const _ of sv) {
                /* noop */
            }
        },
        setup: () => new StringView(testData.mediumMixed),
    },

    // Whitespace handling
    {
        name: 'trim-small',
        fn: (sv: StringView) => sv.trim(),
        setup: () => new StringView(testData.mixedWhitespace),
    },
    {
        name: 'trim-large',
        fn: (sv: StringView) => sv.trim(),
        setup: () => new StringView(`   ${testData.largeMixed}   `),
    },

    // Chopping operations
    {
        name: 'chopLeft-ascii',
        fn: (sv: StringView) => sv.chopLeft(5),
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: 'chopLeft-unicode',
        fn: (sv: StringView) => sv.chopLeft(5),
        setup: () => new StringView(testData.mediumMixed),
    },

    // Parsing operations
    {
        name: 'parseInt',
        fn: (sv: StringView) => sv.toInt(),
        setup: () => new StringView(testData.integers),
    },
    {
        name: 'parseFloat',
        fn: (sv: StringView) => sv.toFloat(),
        setup: () => new StringView(testData.floats),
    },

    // Complex operations
    {
        name: 'complex-emoji-handling',
        fn: (sv: StringView) => {
            sv.charAt(0); // Should handle the family emoji correctly
            sv.charAt(2); // Should handle the technologist emoji correctly
            sv.charAt(4); // Should handle the rainbow flag correctly
        },
        setup: () => new StringView(testData.complexEmoji),
    },

    // Cache effectiveness
    {
        name: 'cached-segmentation',
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) {
                sv.graphemeLength; // Should use cache after first call
            }
        },
        setup: () => new StringView(testData.mediumMixed),
    },

    // Number chopping operations
    {
        name: 'chopInt-simple',
        fn: (sv: StringView) => sv.chopInt(),
        setup: () => new StringView('12345'),
    },
    {
        name: 'chopInt-signed',
        fn: (sv: StringView) => sv.chopInt(),
        setup: () => new StringView('-12345'),
    },
    {
        name: 'chopInt-mixed',
        fn: (sv: StringView) => {
            const view = new StringView(testData.mixedIntegers);
            const results = [];
            let result = view.chopInt();
            while (result.success) {
                results.push(result.data);
                view.trimLeft(); // Skip any whitespace
                result = view.chopInt();
            }
            return results;
        },
        setup: () => null, // Setup is handled in fn
    },
    {
        name: 'chopFloat-simple',
        fn: (sv: StringView) => sv.chopFloat(),
        setup: () => new StringView('123.456'),
    },
    {
        name: 'chopFloat-signed',
        fn: (sv: StringView) => sv.chopFloat(),
        setup: () => new StringView('-123.456'),
    },
    {
        name: 'chopFloat-mixed',
        fn: (sv: StringView) => {
            const view = new StringView(testData.mixedFloats);
            const results = [];
            let result = view.chopFloat();
            while (result.success) {
                results.push(result.data);
                view.trimLeft(); // Skip any whitespace
                result = view.chopFloat();
            }
            return results;
        },
        setup: () => null, // Setup is handled in fn
    },
];

// Run the benchmark
const { functionName, options } = parseArgs(process.argv);
runBenchmark(functionName, testCases, options);
