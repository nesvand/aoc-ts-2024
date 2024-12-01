import { type StringView, isWhitespace } from '@lib/string-view';

export function int(sv: StringView) {
    const result = sv.chopInt();
    if (!result.success) throw new Error('Failed to parse integer');
    return result.data;
}

export function word(sv: StringView) {
    const out = sv.chopLeftWhile((c) => !isWhitespace(c));
    return out.toString();
}

export function float(sv: StringView) {
    const result = sv.chopFloat();
    if (!result.success) throw new Error('Failed to parse float');
    return result.data;
}

export function optional(sv: StringView) {
    if (isWhitespace(sv.charAt(0))) return '';
    return sv.chopLeft(1).toString();
}

export type Tokens = typeof int | typeof word | typeof float | typeof optional;
