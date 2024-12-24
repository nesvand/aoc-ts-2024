// Advent of Code - Day 23
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day23';

let input = '';
try {
    input = await Bun.file('src/day23/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`
        kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`)).toBe(7);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(1423);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`
        kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`)).toBe('co,de,ka,ta');
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe('gt,ha,ir,jn,jq,kb,lr,lt,nl,oj,pp,qh,vy');
    });
}
