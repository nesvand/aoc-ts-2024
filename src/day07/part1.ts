// Advent of Code - Day 7 - Part One

export function tryDivide(a: number, b: number): number {
    return a % b === 0 ? a / b : -1;
}

export function tryAdd(a: number, b: number): number {
    return a - b;
}

export function bindCanEval(ops: Array<(a: number, b: number) => number>) {
    return function canEval(equation: number[], target: number, i = equation.length - 1): boolean {
        // If we're at the first index check to see if our current target value matches
        if (i === 0) return target === equation[0];
        // Our target can't be negative, so this is an immediate fail
        if (target < 0) return false;

        // Branch out back through the equation, checking until we've exhausted all operations in reverse order
        return ops.some((op) => canEval(equation, op(target, equation[i]), i - 1));
    }
}

export function part1(input: string): number {
    const items = input.trim()
        .replaceAll('\r', '')
        .split('\n')
        // biome-ignore lint/style/noNonNullAssertion: we know the numbers are there
        .map((line) => line.match(/\d+/g)!.map(Number));

    const evalsTo = bindCanEval([tryDivide, tryAdd]);
    return items.filter(([target, ...equation]) => evalsTo(equation, target)).reduce((acc, [target]) => acc + target, 0);
}
