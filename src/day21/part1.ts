// Advent of Code - Day 21 - Part One

import memoize from "memoize";

// Mapping 1D arrays to 2D pads
const PAD_CONFIG = '789456123X0A';
const DIRPAD_CONFIG = 'X^A<v>';

type Queue = {
    x: number;
    y: number;
    keysPressed: string;
}

const cheapestDirPad = memoize((x: number, y: number, nx: number, ny: number, numRobots: number): bigint => {
    let answer = BigInt(Number.MAX_SAFE_INTEGER);

    const q: Queue[] = [];
    q.push({ x, y, keysPressed: '' });

    while (q.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: We know it's not empty
        const v = q.shift()!;
        if (v.x === nx && v.y === ny) {
            const record = cheapestRobot(`${v.keysPressed}A`, numRobots - 1);
            answer = answer < record ? answer : record;
            continue;
        }

        // Invalid empty pad
        if (v.x === 0 && v.y === 0) continue;

        if (v.x < nx) q.push({ y: v.y, x: v.x + 1, keysPressed: `${v.keysPressed}>` });
        else if (v.x > nx) q.push({ y: v.y, x: v.x - 1, keysPressed: `${v.keysPressed}<` });
        if (v.y < ny) q.push({ y: v.y + 1, x: v.x, keysPressed: `${v.keysPressed}v` });
        else if (v.y > ny) q.push({ y: v.y - 1, x: v.x, keysPressed: `${v.keysPressed}^` });
    }

    return answer;
}, { cacheKey: (...args) => args.join(',') });


function cheapestRobot(keysPressed: string, numRobots: number): bigint {
    if (numRobots === 1) return BigInt(keysPressed.length);

    let result = 0n;

    // Start at 'A'
    let [x, y] = [2, 0];

    for (let i = 0; i < keysPressed.length; i++) {
        for (let nx = 0; nx < 3; nx++) {
            for (let ny = 0; ny < 2; ny++) {
                if (DIRPAD_CONFIG[ny * 3 + nx] === keysPressed[i]) {
                    result += cheapestDirPad(x, y, nx, ny, numRobots);
                    y = ny;
                    x = nx;
                }
            }
        }
    }

    return result;
}

function cheapest(x: number, y: number, nx: number, ny: number, numRobots: number): bigint {
    let answer = BigInt(Number.MAX_SAFE_INTEGER);

    const q: Queue[] = [];
    q.push({ x, y, keysPressed: '' });

    while (q.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: We know it's not empty
        const v = q.shift()!;
        if (v.x === nx && v.y === ny) {
            const record = cheapestRobot(`${v.keysPressed}A`, numRobots);
            answer = answer < record ? answer : record;
            continue;
        }

        // Invalid empty pad
        if (v.x === 0 && v.y === 3) continue;

        if (v.x < nx) q.push({ y: v.y, x: v.x + 1, keysPressed: `${v.keysPressed}>` });
        else if (v.x > nx) q.push({ y: v.y, x: v.x - 1, keysPressed: `${v.keysPressed}<` });
        if (v.y < ny) q.push({ y: v.y + 1, x: v.x, keysPressed: `${v.keysPressed}v` });
        else if (v.y > ny) q.push({ y: v.y - 1, x: v.x, keysPressed: `${v.keysPressed}^` });
    }

    return answer;
}

export function processCodes(codes: string[], numRobots = 3): bigint {
    let sum = 0n;
    for (const code of codes) {
        let result = 0n;

        // Start at 'A'
        let [x, y] = [2, 3];

        for (let i = 0; i < code.length; i++) {
            for (let nx = 0; nx < 3; nx++) {
                for (let ny = 0; ny < 4; ny++) {
                    if (PAD_CONFIG[ny * 3 + nx] === code[i]) {
                        result += cheapest(x, y, nx, ny, numRobots);
                        y = ny;
                        x = nx;
                    }
                }
            }
        }

        // biome-ignore lint/style/noNonNullAssertion: We know it's not null
        const codeVal = BigInt(Number.parseInt(code.match(/\d+/)![0], 10));
        sum += result * codeVal;
    }

    return sum;
}

export function part1(input: string): bigint {
    const codes = input.trim().split('\n');
    return processCodes(codes);
}
