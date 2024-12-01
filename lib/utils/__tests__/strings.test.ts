import { describe, expect, test } from 'bun:test';
import { StringView } from '@lib/string-view';
import { extractTokens, float, int, word } from '@lib/strings';

describe('@lib/utils/strings', () => {
    describe('extract', () => {
        describe('with string input', () => {
            test('should extract values from a string', () => {
                const input = 'Hello 123 World';
                const result = extractTokens`Hello ${int} World`(input);
                expect(result).toEqual([123]);
            });

            test('should extract multiple values from a string', () => {
                const input = 'Hello 123 World 456';
                const result = extractTokens`Hello ${int} World ${int}`(input);
                expect(result).toEqual([123, 456]);
            });

            test('should reuse buffer for multiple extractions', () => {
                const extract = extractTokens`Hello ${int} World`;
                const result1 = extract('Hello 123 World');
                const result2 = extract('Hello 456 World');
                expect(result1).toEqual([123]);
                expect(result2).toEqual([456]);
            });
        });

        describe('with StringView input', () => {
            test('should extract values without modifying original StringView', () => {
                const input = new StringView('Hello 123 World');
                const originalContent = input.toString();
                const result = extractTokens`Hello ${int} World`(input);

                expect(result).toEqual([123]);
                expect(input.toString()).toBe(originalContent);
            });

            test('should extract multiple values without modifying original StringView', () => {
                const input = new StringView('Hello 123 World 456.789 Foo');
                const originalContent = input.toString();
                const result = extractTokens`Hello ${int} World ${float} ${word}`(input);

                expect(result).toEqual([123, 456.789, 'Foo']);
                expect(input.toString()).toBe(originalContent);
            });
        });

        test('should extract multiple values with mixed types', () => {
            const input = 'Hello 123 World Foo 456.789';
            const result = extractTokens`Hello ${int} World ${word} ${float}`(input);
            expect(result).toEqual([123, 'Foo', 456.789]);
        });
    });
});
