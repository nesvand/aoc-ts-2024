import { StringView } from '@lib/string-view';
import type { Tokens } from './tokens';

type Token<C extends Tokens[]> = C extends [infer First extends Tokens, ...infer Rest extends Tokens[]]
    ? [ReturnType<First>, ...Token<Rest>]
    : [];

export function extractTokens<C extends Tokens[]>(parts: TemplateStringsArray, ...parsers: C) {
    const buffer = new StringView('');
    return (input: StringView | string): Token<C> => {
        const result: unknown[] = [];
        if (typeof input === 'string') {
            buffer.reset(input);
        } else {
            buffer.copyFrom(input);
        }

        let sv: StringView | undefined;
        for (let i = 0; i < parsers.length; i++) {
            const part = parts[i];
            if (part === undefined) throw new ReferenceError('Part not found');
            if (!sv) {
                sv = new StringView(part);
            } else {
                sv.reset(part);
            }
            buffer.chopByStringView(sv);
            const parser = parsers[i];
            if (parser === undefined) throw new ReferenceError('Parser not found');
            result.push(parser(buffer));
        }
        return result as Token<C>;
    };
}
