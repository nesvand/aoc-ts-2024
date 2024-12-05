// Advent of Code - Day 5 - Part Two

import { validPages } from "./part1";

export function part2(input: string): number {
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

    const isValid = validPages(rules);

    const correctedPages = pagesList.filter((pages) => !isValid(pages)).map((pages) => {
        /* The magic of knowing if a page must come after another page (see part 1) allows us to sort the pages in the correct order */
        pages.sort((a, b) => {
            /* If b is included in the rules for a, then a must come before b (sort a back, -1) */
            if (rules[a]?.includes(b)) return -1;
            /* If a is included in the rules for b, then b must come before a (sort a forward, 1) */
            if (rules[b]?.includes(a)) return 1;
            return 0
        });
        return pages;
    })

    const middles = correctedPages.map((pages) => pages[Math.floor(pages.length / 2)]);
    return middles.reduce((a, b) => a + b, 0);
}
