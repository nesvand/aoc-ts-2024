// Advent of Code - Day 5 - Part One

export function validPages(rules: Record<number, number[]>) {
    return (pages: number[]): boolean => {
        for (const [idx, page] of pages.entries()) {
            const pagesAfter = pages.slice(idx + 1);
            if (!rules[page]) continue;
            for (const rule of rules[page]) {
                if (pages.includes(rule) && !pagesAfter.includes(rule)) {
                    return false;
                }
            }
        }
        return true;
    }
}

export function part1(input: string): number {
    const [rawRules, rawPagesList] = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));
    const rules = rawRules.reduce((rs, line) => {
        const [x, y] = line.split('|').map(Number);
        rs[x] ??= [];
        rs[x].push(y);
        return rs;
    }, {} as Record<number, number[]>);
    const pagesList = rawPagesList.map((pages) => pages.split(',').map(Number));
    const correctPages = pagesList.filter(validPages(rules));
    const middles = correctPages.map((pages) => pages[Math.floor(pages.length / 2)]);
    return middles.reduce((a, b) => a + b, 0);
}
