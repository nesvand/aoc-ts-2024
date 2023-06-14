export function isWhitespace(char?: string) {
    if (char === undefined) {
        return false;
    }

    return (
        char === ' ' || char === '\n' || char === '\t' || char === '\r' || char === '\f' || char === '\v' || char === '\u00A0' || char === '\uFEFF'
    );
}

function isDigit(char?: string) {
    if (char === undefined) {
        return false;
    }
    return char >= '0' && char <= '9';
}

export class StringView {
    _source: { data: string };
    start = 0;
    size: number;

    constructor(data: string) {
        this._source = { data };
        this.size = data.length;
    }

    static fromStringView(sv: StringView) {
        const copy = new StringView('');
        copy._source = sv._source;
        copy.start = sv.start;
        copy.size = sv.size;

        return copy;
    }

    static fromParts(source: { data: string }, start: number, size: number) {
        const copy = new StringView('');
        copy._source = source;
        copy.start = start;
        copy.size = size;

        return copy;
    }

    private get data() {
        return this._source.data.substring(this.start, this.start + this.size);
    }

    public charAt(index: number): string {
        return this.data.charAt(index);
    }

    public indexOf(search: string): number {
        return this.data.indexOf(search);
    }

    public eq(other: StringView) {
        return this.data === other.data;
    }

    public eqIgnoreCase(other: StringView) {
        return this.data.toLowerCase() === other.data.toLowerCase();
    }

    public startsWith(search: StringView) {
        return this.data.startsWith(search.data);
    }

    public endsWith(search: StringView) {
        return this.data.endsWith(search.data);
    }

    public toString() {
        return this.data;
    }

    public trimLeft() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(i))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start + i, this.size - i);
    }

    public trimRight() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(this.data.length - i - 1))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start, this.size - i);
    }

    public trim() {
        return this.trimLeft().trimRight();
    }

    public takeLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start, i);
    }

    public chopLeft(size: number) {
        if (size > this.data.length) {
            size = this.data.length;
        }

        const result = StringView.fromParts(this._source, this.start, size);
        this.start += size;
        this.size -= size;

        return result;
    }

    public chopRight(size: number) {
        if (size > this.data.length) {
            size = this.data.length;
        }

        const result = StringView.fromParts(this._source, this.start + this.size - size, size);
        this.size -= size;

        return result;
    }

    public tryChopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const data = StringView.fromParts(this._source, this.start, i);

        if (i < this.size) {
            this.start += i + 1;
            this.size -= i + 1;
            return { data, success: true };
        }

        return { success: false };
    }

    public chopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const result = StringView.fromParts(this._source, this.start, i);

        if (i < this.size) {
            this.start += i + 1;
            this.size -= i + 1;
        } else {
            this.start += i;
            this.size -= i;
        }

        return result;
    }

    public chopByStringView(delim: StringView) {
        const window = StringView.fromParts(this._source, this.start, delim.size);
        let i = 0;
        while (i + delim.size < this.size && !window.eq(delim)) {
            i++;
            window.start++;
        }

        const result = StringView.fromParts(this._source, this.start, i);

        if (i + delim.size === this.size) {
            result.size += delim.size;
        }

        this.start += i + delim.size;
        this.size -= i + delim.size;

        return result;
    }

    public toInt() {
        let result = 0;

        for (let i = 0; i < this.data.length && isDigit(this.data.charAt(i)); i++) {
            result = result * 10 + parseInt(this.data.charAt(i));
        }

        return result;
    }

    public toFloat() {
        let result = 0.0;
        let decimal = 0.0;

        for (let i = 0; i < this.data.length; i++) {
            if (this.data.charAt(i) === '.') {
                decimal = 1.0;
            } else if (!isDigit(this.data.charAt(i))) {
                return result;
            } else {
                if (decimal > 0.0) {
                    decimal *= 0.1;
                    result += decimal * parseInt(this.data.charAt(i));
                } else {
                    result = result * 10 + parseInt(this.data.charAt(i));
                }
            }
        }

        return result;
    }

    public chopInt() {
        let result = 0;
        while (this.size > 0 && isDigit(this.charAt(0))) {
            result = result * 10 + parseInt(this.charAt(0));
            this.start++;
            this.size--;
        }

        return result;
    }

    public chopFloat() {
        let result = 0.0;
        let decimal = 0.0;

        while (this.size > 0) {
            if (this.charAt(0) === '.') {
                decimal = 1.0;
            } else if (!isDigit(this.charAt(0))) {
                return result;
            } else {
                if (decimal > 0.0) {
                    decimal *= 0.1;
                    result += decimal * parseInt(this.charAt(0));
                } else {
                    result = result * 10 + parseInt(this.charAt(0));
                }
            }

            this.start++;
            this.size--;
        }

        return result;
    }

    public chopLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        const result = StringView.fromParts(this._source, this.start, i);
        this.start += i;
        this.size -= i;

        return result;
    }
}
