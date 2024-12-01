# Advent of Code Typescript Starter

[![CI](https://github.com/nesvand/aoc-ts-starter/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nesvand/aoc-ts-starter/actions/workflows/ci.yml?query=branch%3Amain)
[![Test Report](https://github.com/nesvand/aoc-ts-starter/actions/workflows/test-report.yml/badge.svg?branch=main)](https://github.com/nesvand/aoc-ts-starter/actions/workflows/test-report.yml?query=branch%3Amain)

A template for [Advent of Code](https://adventofcode.com) written in Typescript with Node.

(Adapted from https://github.com/ljgago - repo not available)

## Features

### Core Functionality
- Automatic file generation for each day's challenge
- Automatic input download from Advent of Code
- Test-driven development setup
- Bun runtime for fast execution

### Enhanced String Processing
The project includes a robust `StringView` class for efficient string manipulation:

- **Unicode Support**
  - Full Unicode character handling including emojis and combining characters
  - Proper grapheme cluster handling for complex emoji sequences
  - CJK character support
  - Unicode whitespace handling

- **String Operations**
  - Delimiter-based string splitting (including multi-character delimiters)
  - Comprehensive whitespace trimming
  - Instance reuse through reset functionality

- **Number Parsing**
  - Integer parsing with sign handling
  - Floating-point parsing with proper precision

### Data Structure Examples
The project includes detailed examples for various data structures that can help in solving puzzles, and just in general!

- [Binary Heap](lib/utils/data/BINARY_HEAP.md) - Priority queues and scheduling
- [Ring Buffer](lib/utils/data/RING_BUFFER.md) - Circular queues and sliding windows
- [Segment Tree](lib/utils/data/SEGMENT_TREE.md) - Range queries and updates
- [Trie](lib/utils/data/TRIE.md) - Prefix-based string operations
- [Disjoint Set](lib/utils/data/DISJOINT_SET.md) - Connected components and grouping
- [Combined Examples](lib/utils/data/COMBINED_EXAMPLES.md) - Using multiple data structures together

Each example includes practical use cases and implementation patterns.

### Benchmarking
Built-in benchmarking utilities for performance testing:
```bash
bun run lib/utils/array.bench.ts <function-name> [options]
```

Options:
  -w, --warmup  Number of warmup iterations       [number] [default: 0]
  -r, --runs    Number of benchmark runs          [number] [default: 1000]
  -h, --help    Show help                         [boolean]

View the latest benchmark results in [BENCHMARKS.md](lib/bench/BENCHMARKS.md).

## Usage

The project uses [Bun](https://bun.sh) for the javascript runtime, package manager, and for testing.

```bash
git clone https://github.com/nesvand/aoc-ts-starter
cd aoc-ts-starter
# install dependencies
bun install
# ensure you have AOC_SESSION and/or AOC_YEAR set as environment variables accordingly
# generate files for day01
bun gen day01
# run tests for day01
bun test day01
# run day01
bun start day01
# run all benchmarks
bun run lib/bench/run-all.ts
```

### Using StringView

StringView provides efficient string manipulation without unnecessary allocations:

```typescript
// Create a StringView instance
const sv = new StringView("Hello World");

// Parse numbers
sv.reset("123.456");
const num = sv.chopFloat(); // { success: true, data: 123.456 }

// Reuse the instance
sv.reset("Another string");
const word = sv.chopLeftWhile(c => !isWhitespace(c));

// Reset to initial state
sv.reset();
```

## Generate

You can generate all necessary files for use in the event with a simple command:

    $ bun gen day01

This command generates these files:

    * creating src/day01/resources/input.txt
    * creating src/day01/index.ts
    * creating src/day01/main.ts
    * creating src/day01/part1.ts
    * creating src/day01/part2.ts
    * creating src/day01/README.md
    * creating test/day01.test.spec.ts

## Config

You can configure the automatic input download from Advent of Code by using your session token.

To download the inputs from web, you need to set the environment var `AOC_SESSION`.
You can to get the session token from the cookie web browser.

Also can you set the `AOC_YEAR` to select a certain year.

(It is not mandatory use the `AOC_YEAR`, the `bun gen` can get the year automatically)

You can set an `.env` file with these variables.

## Additional Credits

- Original template by [ljgago](https://github.com/ljgago)
- `StringView` is adapted from [sv](https://github.com/tsoding/sv) by [Alexey Kutepov](https://github.com/tsoding)
- Enhanced with full Unicode support and additional string processing capabilities

[MIT License](LICENSE)
