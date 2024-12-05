// Advent of Code - Day 5 - Part One

export function validPages(rules: Record<number, number[]>) {
    return (pages: number[]): boolean => {
        /*
            Obviously we validate the pages by going through each entry and checking to make sure it's valid.
            But what does "valid" mean? All we know is which pages a given page must come before - ie. the rule
            "75|94" means that page 75 must come before page 94.
        */
        for (const [idx, page] of pages.entries()) {
            /* Seeing as we can only validate against what's after the current page, we need to check the pages after */
            const pagesAfter = pages.slice(idx + 1);

            /* If the current page has no rule then there's no rule to violate, continue */
            if (!rules[page]) continue;

            /* We loop through the "rules" for the current page (ie. the list of pages that must come after it) */
            for (const rule of rules[page]) {
                /* Firstly we check if the rule is in the pages we're checking, if not then we don't care (see below for why) */
                /* Secondly, now that we know the rule is in the pages we're checking, it must be included in the pages after (or we'd have a rule violation) */
                if (pages.includes(rule) && !pagesAfter.includes(rule)) {
                    return false;
                }
            }
        }
        return true;
    }
}

export function part1(input: string): number {
    // splitting the chunks into rules and the pages-to-check list
    const [rawRules, rawPagesList] = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));

    /*
        We reshape the rules that look like this: "75|94" into a map of pages that must come before another page.
        For example, the above rule means that page 75 must come before page 94.
        
        For example, given the rules: "75|94", "94|62", "62|42", "42|1", "75|1"
        The rules would look like this:
        {
            75: [94,1],
            94: [62],
            62: [42],
            42: [1]
        }

        Importantly, the rule only applies if both the values are in present in the pages we're checking.
        ie. 75 must come before 94 if both 75 and 94 are present in the pages
    */
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
