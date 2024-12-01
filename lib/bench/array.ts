import * as arrayUtils from '@lib/array';
import { type TestCase, parseArgs, runBenchmark } from '@lib/bench';
import { ArrayBenchmarks } from './types';

// Pre-generate a fixed set of numbers
const ARRAY_SIZE = 100000;
const testData = {
    numbers: Array.from({ length: ARRAY_SIZE }, (_, i) => i % 1000),
    sequential: Array.from({ length: ARRAY_SIZE }, (_, i) => i),
};

const testCases: TestCase[] = [
    {
        name: ArrayBenchmarks.MAX,
        fn: arrayUtils.max,
        setup: () => testData.numbers,
    },
    {
        name: ArrayBenchmarks.SPLIT_ON,
        fn: (arr: number[]) => arrayUtils.splitOn(arr, (n) => n % 100 === 0),
        setup: () => testData.sequential,
    },
    {
        name: ArrayBenchmarks.CHUNK,
        fn: (arr: number[]) => arrayUtils.chunk(arr, 100),
        setup: () => testData.sequential,
    },
    {
        name: ArrayBenchmarks.ROLLING_WINDOW,
        fn: (arr: number[]) => {
            // Consume the iterator to ensure fair comparison
            const windows: number[][] = [];
            for (const window of arrayUtils.rollingWindow(arr, 50)) {
                windows.push(window);
            }
            return windows;
        },
        setup: () => testData.sequential,
    },
];

const { functionName, options } = parseArgs(process.argv.slice(2));
runBenchmark(functionName, testCases, options);
