// Advent of Code - Day 11 - Part One

/*
    Rules:
    - If stone equals 0, replace the stone with a value of 1
    - If the stone has an even number of digits (ie. 12, 1234, 123456, etc.), split the number into two numbers, and replace with two stones of those values
      - ie. 12 becomes 1 and 2, 1234 becomes 12 and 34, 123456 becomes 123 and 456
    - If none of the other rules apply, the stone is replaced by a new stone multiplied by 2024, ie. 100 becomes 202400
    - Order is preserved
*/

const functionMemo = new Map<string, (...args: unknown[]) => unknown>();
export function memoize<Args extends unknown[], Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret {
    const functionName = fn.name;
    const memo = new Map<string, Ret>();

    if (functionMemo.has(fn.name)) return functionMemo.get(fn.name) as (...args: Args) => Ret;
    const memoizedFn = (...args: Args) => {
        const key = JSON.stringify(args);
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        if (memo.has(key)) return memo.get(key)!;
        const result = fn(...args);
        memo.set(key, result);
        return result;
    };
    functionMemo.set(functionName, memoizedFn as (...args: unknown[]) => unknown);
    console.log(`Memoized ${functionName}`);
    return memoizedFn;
}

export function processStone(stone: number, blinks: number): number {
    const _processStone = memoize(processStone);
    if (blinks === 0) return 1;

    let total = 0;
    const stoneString = stone.toString();
    if (stone === 0) total = _processStone(1, blinks - 1);
    else if (stoneString.length % 2 === 0) {
        const left = Number.parseInt(stoneString.slice(0, stoneString.length / 2));
        const right = Number.parseInt(stoneString.slice(-stoneString.length / 2));
        total = _processStone(left, blinks - 1) + _processStone(right, blinks - 1);
    } else {
        total = _processStone(stone * 2024, blinks - 1);
    }
    return total;
}

export function part1(input: string): number {
    const stones = input.trim().split(' ').map(Number);
    const _processStone = memoize(processStone);

    const blinks = 25;
    let total = 0;
    for (const stone of stones) {
        total += _processStone(stone, blinks);
    }

    return total;
}
