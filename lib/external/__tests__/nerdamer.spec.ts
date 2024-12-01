import { describe, expect, test } from 'bun:test';
const nerdamer = require('nerdamer/all');

describe('nerdamer', () => {
    describe('examples', () => {
        test('generating expression', () => {
            const expression = nerdamer('x^2+2*(cos(x)+x*x)');

            expect(expression.text()).toBe('2*cos(x)+3*x^2');
        });

        test('generating expression with known value', () => {
            const expression = nerdamer('x^2+2*(cos(x)+x*x)', { x: 6 });

            expect(expression.text()).toBe('108+2*cos(6)');
        });

        test('evaluating expression', () => {
            const result = nerdamer('x^2+2*(cos(x)+x*x)', { x: 6 }).evaluate();

            expect(result.text()).toBe('109.920340573300735448');
        });

        test('expression substitution with another expression', () => {
            const expression = nerdamer('x^2+2*(cos(x)+x*x)', { x: 'y^2' });

            expect(expression.text()).toBe('2*cos(y^2)+3*y^4');
        });
    });
});
