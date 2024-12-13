// Advent of Code - Day 13 - Part One

/*
  target x = ax * presses a + bx * presses b
  target y = ay * presses a + bx * presses b
  
  presses a = (target x - bx * presses b) / ax (ax !== 0) <-- or
  presses a = (target y - by * presses b) / ay (ay !== 0) <-- 
  
  (target x - bx * presses b) / ax === (target y - by * presses b) / ay (ay !== 0)
  
  ay * (target x - bx * presses b) === ax * (target y - by * presses b)
  ay * target x - ay * bx * presses b === ax * target y - ax * by * presses b
  ay * target x - ax * target Y === ay * bx * presses b - ax * by * presses b
  ay * target x - ax * target Y === presses b * (ay * bx - ax * by)

  presses b = (ay * target x - ax * target Y) / (ay * bx - ax * by) <--
*/

export function minTokens([ax, ay]: [number, number], [bx, by]: [number, number], [tx, ty]: [number, number]): { a: number; b: number } | null {
    if ([ax, ay, bx, by].some((v) => v === 0)) return null;
    const pb = Math.floor((ay * tx - ax * ty) / (ay * bx - ax * by));
    const pa = Math.floor((tx - bx * pb) / ax);
    return ax * pa + bx * pb === tx && ay * pa + by * pb === ty ? { a: pa, b: pb } : null;
}

export function part1(input: string): number {
    const items = input.trim()
        .split('\n\n')
        .map((lines) => {
            const [a, b, prize] = lines.split('\n');
            const [ax, ay] = a.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            const [bx, by] = b.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            const [px, py] = prize.matchAll(/\d+/g).map((m) => Number.parseInt(m[0]));
            return {
                a: { x: ax, y: ay },
                b: { x: bx, y: by },
                prize: { x: px, y: py },
            };
        });
    let tokens = 0;
    for (const { a, b, prize } of items) {
        const presses = minTokens([a.x, a.y], [b.x, b.y], [prize.x, prize.y]);
        if (presses === null) continue;
        tokens += presses.a * 3 + presses.b;
    }
    return tokens;
}
