import { spawn } from 'bun';
import { ArrayBenchmarks, BitsBenchmarks, StringViewBenchmarks } from './types';

interface BenchmarkResult {
    name: string;
    category: string;
    meanNanos: number;
    marginNanos: number;
    opsPerSec: number;
}

async function runBenchmark(category: string, name: string): Promise<BenchmarkResult> {
    const process = spawn(['bun', 'run', `lib/bench/${category}.ts`, name, '-w 100', '-r 1000']);
    const decoder = new TextDecoder();

    try {
        for await (const rawLine of process.stdout) {
            const line = decoder.decode(rawLine);
            if (line.includes('Mean:')) {
                const meanMatch = line.match(/Mean:\s+(\d+\.\d+)(µs|ms|ns|s)\s+±(\d+\.\d+)(µs|ms|ns|s)/);
                if (!meanMatch) {
                    console.log('Failed to parse output:', line);
                    throw new Error(`Could not parse mean time from output: ${line}`);
                }

                const [, meanTime, meanUnit, marginTime, marginUnit] = meanMatch;
                if (!meanTime || !meanUnit || !marginTime || !marginUnit) {
                    throw new Error('Missing time or unit in matoh');
                }

                const meanNanos = convertToNanos(Number(meanTime), meanUnit);
                const marginNanos = convertToNanos(Number(marginTime), marginUnit);
                const opsPerSec = 1_000_000_000 / meanNanos;

                return {
                    name,
                    category,
                    meanNanos,
                    marginNanos,
                    opsPerSec,
                };
            }
        }

        throw new Error('No range found in output');
    } catch (err) {
        process.kill();
        throw err;
    }
}

function convertToNanos(value: number, unit: string): number {
    const normalizedUnit = unit === 'µs' || unit === 'us' || unit === '\u00B5s' ? 'µs' : unit;

    switch (normalizedUnit) {
        case 'ns':
            return value;
        case 'µs':
            return value * 1000;
        case 'ms':
            return value * 1_000_000;
        case 's':
            return value * 1_000_000_000;
        default:
            console.error(
                'Unit code points:',
                [...unit].map((c) => c.charCodeAt(0)),
            );
            throw new Error(`Unknown time unit: ${unit} (${[...unit].map((c) => c.charCodeAt(0))})`);
    }
}

function formatTime(nanos: number): string {
    if (nanos < 1000) {
        return `${nanos.toFixed(2)}ns`;
    }
    if (nanos < 1_000_000) {
        return `${(nanos / 1000).toFixed(2)}µs`;
    }
    if (nanos < 1_000_000_000) {
        return `${(nanos / 1_000_000).toFixed(2)}ms`;
    }
    return `${(nanos / 1_000_000_000).toFixed(2)}s`;
}

async function runAllBenchmarks(): Promise<void> {
    const results: BenchmarkResult[] = [];
    const benchmarks = [
        { category: 'array', tests: Object.values(ArrayBenchmarks) },
        { category: 'bits', tests: Object.values(BitsBenchmarks) },
        { category: 'string-view', tests: Object.values(StringViewBenchmarks) },
    ];

    for (const { category, tests } of benchmarks) {
        console.log(`Running ${category} benchmarks...`);
        for (const test of tests) {
            try {
                const result = await runBenchmark(category, test);
                results.push(result);
                console.log(`  ✓ ${test}`);
            } catch (error) {
                console.error(`  ✗ ${test}:`, error);
            }
        }
    }

    const markdown = generateMarkdownTable(results);
    await Bun.write('lib/bench/BENCHMARKS.md', markdown);
    console.log('\nBenchmark results written to lib/bench/BENCHMARKS.md');
}

function generateMarkdownTable(results: BenchmarkResult[]): string {
    const now = new Date().toISOString();
    let markdown = `# Benchmark Results\n\nGenerated on: ${now}\n\n`;

    const categories = [...new Set(results.map((r) => r.category))];

    for (const category of categories) {
        const categoryResults = results.filter((r) => r.category === category);

        markdown += `\n## ${category.charAt(0).toUpperCase() + category.slice(1)} Benchmarks\n\n`;
        markdown += '| Benchmark | Mean | Margin | Operations/sec |\n';
        markdown += '|-----------|------|--------|---------------|\n';

        // Sort by ops/sec descending
        categoryResults.sort((a, b) => b.opsPerSec - a.opsPerSec);

        for (const result of categoryResults) {
            const opsFormatted = result.opsPerSec.toLocaleString(undefined, {
                maximumFractionDigits: 2,
            });
            markdown += `| ${result.name} | ${formatTime(result.meanNanos)} | ±${formatTime(result.marginNanos)} | ${opsFormatted} |\n`;
        }

        markdown += '\n';
    }

    return markdown;
}

// Run all benchmarks
runAllBenchmarks().catch(console.error);
