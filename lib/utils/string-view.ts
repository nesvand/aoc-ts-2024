// Copyright 2021 Alexey Kutepov <reximkut@gmail.com>
// Copyright 2023 Andrew Nesvadba <nesvand@gmail.com>

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/** Checks if a character is whitespace according to Unicode standards */
export function isWhitespace(char?: string): boolean {
    return Boolean(char?.match(/\s/));
}

/** Checks if a character is a decimal digit (0-9) */
export function isDigit(char?: string): boolean {
    return Boolean(char?.match(/^\d$/));
}

/** Result type for operations that might fail */
export type Result<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          data?: undefined;
      };

/**
 * A utility class for parsing strings in an immutable way. Memory is only allocated
 * when the `data` getter is accessed. This ensures non-destructive string operations
 * while maintaining reference to the original string.
 */
export class StringView {
    #source: string;
    #start = 0;
    #size: number;
    // Cache segmenter and segments
    #segmenter?: Intl.Segmenter;
    #segments?: Array<{ segment: string; index: number }>;
    // Cache for computed values
    #lengthInGraphemes?: number;
    #trimmedIndices?: { start: number; end: number };

    /**
     * Gets or creates the segmenter instance
     * @private
     */
    private getSegmenter(): Intl.Segmenter {
        if (!this.#segmenter) {
            this.#segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        }
        return this.#segmenter;
    }

    /**
     * Gets or computes the segments for the current view
     * @private
     */
    private getSegments(): Array<{ segment: string; index: number }> {
        if (!this.#segments) {
            // Only create array once and cache it
            const segmenter = this.getSegmenter();
            this.#segments = Array.from(segmenter.segment(this.data));
        }
        return this.#segments;
    }

    /**
     * Invalidates the segment cache when the view changes
     * @private
     */
    private invalidateCache(): void {
        this.#segments = undefined;
    }

    /**
     * Creates a new StringView from a string
     * @param data - The source string to view
     */
    constructor(data: string) {
        this.#source = data;
        this.#size = data.length;
    }

    /**
     * Creates a new StringView from an existing StringView
     * @param sv - The source StringView to copy
     * @returns A new StringView with the same contents
     */
    static fromStringView(sv: StringView): StringView {
        const copy = new StringView('');
        copy.#source = sv.#source;
        copy.#start = sv.#start;
        copy.#size = sv.#size;
        return copy;
    }

    /**
     * Creates a new StringView from parts of a string
     * @param source - The source string
     * @param start - Starting byte offset
     * @param size - Number of bytes to include
     * @returns A new StringView representing the specified portion
     */
    static fromParts(source: string, start: number, size: number): StringView {
        const copy = new StringView('');
        copy.#source = source;
        copy.#start = start;
        copy.#size = size;
        return copy;
    }

    /**
     * Gets the character at the specified grapheme index
     * @param index - The grapheme index
     * @returns The character at the index, or empty string if out of bounds
     */
    public charAt(index: number): string {
        if (index < 0) return '';

        let currentIndex = 0;
        for (const { segment } of this.getSegments()) {
            if (currentIndex === index) return segment;
            currentIndex++;
            if (currentIndex > index) break;
        }
        return '';
    }

    /**
     * Finds the first occurrence of a substring
     * @param search - The substring to find
     * @returns The byte offset of the first occurrence, or -1 if not found
     */
    public indexOf(search: string): number {
        return this.data.indexOf(search);
    }

    /**
     * Checks if this StringView equals another
     * @param other - The StringView to compare with
     * @returns True if the contents are exactly equal
     */
    public eq(other: StringView): boolean {
        return this.data === other.data;
    }

    /**
     * Checks if this StringView equals another, ignoring case
     * @param other - The StringView to compare with
     * @returns True if the contents are equal ignoring case
     */
    public eqIgnoreCase(other: StringView): boolean {
        return this.data.toLowerCase() === other.data.toLowerCase();
    }

    /**
     * Checks if this StringView starts with another
     * @param search - The StringView to search for
     * @returns True if this StringView starts with the search string
     */
    public startsWith(search: StringView): boolean {
        return this.data.startsWith(search.data);
    }

    /**
     * Checks if this StringView ends with another
     * @param search - The StringView to search for
     * @returns True if this StringView ends with the search string
     */
    public endsWith(search: StringView): boolean {
        return this.data.endsWith(search.data);
    }

    /**
     * Removes leading whitespace characters
     * @returns A new StringView with leading whitespace removed
     */
    public trimLeft(): StringView {
        const segments = this.getSegments();
        let i = 0;
        while (i < segments.length && isWhitespace(segments[i]?.segment)) {
            i++;
        }
        const segment = segments[i];
        if (!segment) {
            this.#start += this.#size;
            this.#size = 0;
        } else {
            const offset = segment.index;
            this.#start += offset;
            this.#size -= offset;
        }
        this.invalidateCache();
        return this;
    }

    /**
     * Removes trailing whitespace characters
     * @returns A new StringView with trailing whitespace removed
     */
    public trimRight(): StringView {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        let i = segments.length - 1;
        while (i >= 0) {
            const segment = segments[i];
            if (!segment || !isWhitespace(segment.segment)) {
                break;
            }
            i--;
        }

        // Calculate the new size based on the last non-whitespace character
        const lastSegment = segments[i];
        const newSize = lastSegment ? lastSegment.index + lastSegment.segment.length : 0;
        return StringView.fromParts(this.#source, this.#start, newSize);
    }

    /**
     * Removes both leading and trailing whitespace characters
     * @returns A new StringView with all outer whitespace removed
     */
    public trim(): StringView {
        const { start, end } = this.getTrimmedIndices();
        const segments = this.getSegments();

        if (start > end) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }

        const startSegment = segments[start];
        if (!startSegment) throw new Error('Invalid segment index when creating StringView');
        const startOffset = startSegment.index;
        const endSegment = segments[end];
        if (!endSegment) throw new Error('Invalid segment index when creating StringView');
        const size = endSegment.index + endSegment.segment.length - startOffset;

        return StringView.fromParts(this.#source, this.#start + startOffset, size);
    }

    /**
     * Takes characters from the left while they match a predicate
     * @param predicate - Function that tests each character
     * @returns A new StringView containing the matching characters
     */
    public takeLeftWhile(predicate: (char?: string) => boolean): StringView {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }
        return StringView.fromParts(this.#source, this.#start, i);
    }

    /**
     * Takes characters from the right while they match a predicate
     * @param predicate - Function that tests each character
     * @returns A new StringView containing the matching characters
     */
    public takeRightWhile(predicate: (char?: string) => boolean): StringView {
        let i = this.data.length - 1;
        while (i >= 0 && predicate(this.data.charAt(i))) {
            i--;
        }
        return StringView.fromParts(this.#source, this.#start + i + 1, this.#size - i - 1);
    }

    /**
     * Chops off and returns characters from the left while they match a predicate
     * @param predicate - Function that tests each character
     * @returns A new StringView containing the chopped characters
     */
    public chopLeftWhile(predicate: (char?: string) => boolean): StringView {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        const result = StringView.fromParts(this.#source, this.#start, i);
        this.#start += i;
        this.#size -= i;
        return result;
    }

    /**
     * Chops off and returns characters from the right while they match a predicate
     * @param predicate - Function that tests each character
     * @returns A new StringView containing the chopped characters
     */
    public chopRightWhile(predicate: (char?: string) => boolean): StringView {
        let i = this.data.length - 1;
        while (i >= 0 && predicate(this.data.charAt(i))) {
            i--;
        }

        const result = StringView.fromParts(this.#source, this.#start + i + 1, this.#size - i - 1);
        this.#size = i + 1;
        return result;
    }

    /**
     * Chops the string at a delimiter
     * @param delim - The delimiter to chop at (can be multi-character or Unicode)
     * @returns A new StringView containing everything before the delimiter
     */
    public chopByDelimiter(delim: string): StringView {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        // Get delimiter graphemes
        const delimSegments = [...segmenter.segment(delim)];
        const delimLength = delimSegments.length;

        // Find where the delimiter starts
        let i = 0;
        while (i < segments.length) {
            // Check if current position could be the start of the delimiter
            const remainingSegments = segments.slice(i);
            const potentialDelim = remainingSegments
                .slice(0, delimLength) // Take enough segments for the delimiter
                .map((s) => s.segment)
                .join('');

            if (potentialDelim === delim) {
                // Found the delimiter
                const upToDelim = segments.slice(0, i);
                if (upToDelim.length === 0) {
                    // Delimiter is at start
                    const result = StringView.fromParts(this.#source, this.#start, 0);
                    const afterDelim = segments[i + delimLength];
                    if (!afterDelim) {
                        this.#start = this.#start + this.#size;
                        this.#size = 0;
                        return result;
                    }
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                    return result;
                }
                // Create result up to delimiter
                const segment = segments[i];
                if (!segment) {
                    throw new Error('Invalid segment index when creating StringView');
                }
                const result = StringView.fromParts(this.#source, this.#start, segment.index);

                // Move past delimiter
                const afterDelim = segments[i + delimLength];
                if (!afterDelim) {
                    this.#start += this.#size;
                    this.#size = 0;
                } else {
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                }

                return result;
            }
            i++;
        }

        // Delimiter not found, return entire string
        const result = StringView.fromParts(this.#source, this.#start, this.#size);
        this.#start += this.#size;
        this.#size = 0;
        return result;
    }

    /**
     * Chops the string at a StringView delimiter
     * @param delim - The StringView to use as a delimiter
     * @returns A new StringView containing everything before the delimiter
     */
    public chopByStringView(delim: StringView): StringView {
        const window = StringView.fromParts(this.#source, this.#start, delim.#size);
        let i = 0;
        while (i + delim.#size < this.#size && !window.eq(delim)) {
            i++;
            window.#start++;
        }

        const result = StringView.fromParts(this.#source, this.#start, i);

        if (i + delim.#size === this.#size) {
            result.#size += delim.#size;
        }

        this.#start += i + delim.#size;
        this.#size -= i + delim.#size;

        return result;
    }

    /**
     * Parses and returns an integer from the start of the string
     * @returns The parsed integer value, or 0 if invalid
     */
    public toInt(): number {
        const str = this.data;
        let result = 0;
        let sign = 1;
        let i = 0;

        if (str[0] === '-') {
            sign = -1;
            i++;
        } else if (str[0] === '+') {
            i++;
        }

        for (; i < str.length; i++) {
            const char = str[i];
            if (!char) throw new Error('Unexpected end of string');
            if (!isDigit(char)) break;
            result = result * 10 + (char.charCodeAt(0) - 48);
        }

        return result * sign;
    }

    /**
     * Parses and returns a float from the start of the string
     * @returns The parsed float value, or 0 if invalid
     */
    public toFloat(): number {
        let result = 0.0;
        let sign = 1;
        let offset = 0;

        // Handle sign
        if (this.data.charAt(0) === '-') {
            sign = -1;
            offset = 1;
        } else if (this.data.charAt(0) === '+') {
            offset = 1;
        }

        let foundDecimal = false;
        let decimalPlace = 0.1; // Start at first decimal place

        for (let i = offset; i < this.data.length; i++) {
            const char = this.data.charAt(i);

            if (char === '.' && !foundDecimal) {
                foundDecimal = true;
                continue;
            }

            if (!isDigit(char)) {
                break; // Stop at first non-digit
            }

            const digit = Number.parseInt(char);
            if (foundDecimal) {
                result += digit * decimalPlace;
                decimalPlace *= 0.1;
            } else {
                result = result * 10 + digit;
            }
        }

        return result * sign;
    }

    /** The original source string */
    get source(): string {
        return this.#source;
    }

    /** The current byte offset into the source string */
    get start(): number {
        return this.#start;
    }

    /** The current size in bytes */
    get size(): number {
        return this.#size;
    }

    /**
     * Gets the current view of the string.
     * This is where memory allocation happens, as it creates a new string
     * from the current view parameters.
     * @returns The current string view contents
     */
    get data(): string {
        return this.#source.substring(this.#start, this.#start + this.#size);
    }

    /**
     * Implements the iterator protocol for character-by-character iteration
     * Uses cached segments for better performance
     */
    public *[Symbol.iterator](): Iterator<string> {
        const segments = this.getSegments();
        for (const { segment } of segments) {
            yield segment;
        }
    }

    /**
     * Converts the current view to a string
     * @returns The string representation of the current view
     */
    public toString(): string {
        return this.data;
    }

    /**
     * Chops off and returns the first n graphemes
     * @param size - Number of graphemes to chop
     * @returns A new StringView containing the chopped characters
     */
    public chopLeft(size: number): StringView {
        // Use cached segments
        const segments = this.getSegments();

        // Handle negative and overflow cases
        if (size <= 0) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }

        // If size exceeds available segments, take everything
        if (size >= segments.length) {
            const result = StringView.fromStringView(this);
            this.#start += this.#size;
            this.#size = 0;
            return result;
        }

        // Calculate byte offset for the requested number of graphemes
        const actualSize = Math.min(size, segments.length);
        const byteOffset = (segments[actualSize - 1]?.index ?? 0) + (segments[actualSize - 1]?.segment.length ?? 0);

        const result = StringView.fromParts(this.#source, this.#start, byteOffset);
        this.#start += byteOffset;
        this.#size -= byteOffset;

        // Invalidate cache after modifying the view
        this.invalidateCache();
        return result;
    }

    /**
     * Chops off and returns the last n graphemes
     * @param size - Number of graphemes to chop
     * @returns A new StringView containing the chopped characters
     */
    public chopRight(size: number): StringView {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        // Handle negative and overflow cases
        if (size <= 0) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }

        // If size exceeds available segments, take everything
        if (size >= segments.length) {
            const result = StringView.fromStringView(this);
            this.#start += this.#size;
            this.#size = 0;
            return result;
        }

        // Calculate byte offset for the requested number of graphemes from the end
        const startSegment = segments[segments.length - size];
        if (!startSegment) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }

        const byteOffset = startSegment.index;
        const result = StringView.fromParts(this.#source, this.#start + byteOffset, this.#size - byteOffset);
        this.#size = byteOffset;
        return result;
    }

    /**
     * Attempts to chop the string at a delimiter
     * @param delim - The delimiter to chop at
     * @returns A Result containing the chopped StringView if successful
     */
    public tryChopByDelimiter(delim: string): Result<StringView> {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        // Get delimiter graphemes
        const delimSegments = [...segmenter.segment(delim)];
        const delimLength = delimSegments.length;

        // Find where the delimiter starts
        let i = 0;
        while (i < segments.length) {
            // Check if current position could be the start of the delimiter
            const remainingSegments = segments.slice(i);
            const potentialDelim = remainingSegments
                .slice(0, delimLength)
                .map((s) => s.segment)
                .join('');

            if (potentialDelim === delim) {
                // Found the delimiter
                const upToDelim = segments.slice(0, i);
                if (upToDelim.length === 0) {
                    // Delimiter is at start
                    const result = StringView.fromParts(this.#source, this.#start, 0);
                    const afterDelim = segments[i + delimLength];
                    if (!afterDelim) {
                        this.#start = this.#start + this.#size;
                        this.#size = 0;
                        return { success: true, data: result };
                    }
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                    return { success: true, data: result };
                }

                // Create result up to delimiter
                const segment = segments[i];
                if (!segment) throw new Error('Invalid segment index when creating StringView');
                const result = StringView.fromParts(this.#source, this.#start, segment.index);

                // Move past delimiter
                const afterDelim = segments[i + delimLength];
                if (!afterDelim) {
                    this.#start += this.#size;
                    this.#size = 0;
                } else {
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                }

                return { success: true, data: result };
            }
            i++;
        }

        // Delimiter not found
        return { success: false };
    }

    /**
     * Gets the length in graphemes, cached
     */
    get graphemeLength(): number {
        if (this.#lengthInGraphemes === undefined) {
            this.#lengthInGraphemes = this.getSegments().length;
        }
        return this.#lengthInGraphemes;
    }

    /**
     * Gets the trimmed indices, cached
     */
    private getTrimmedIndices(): { start: number; end: number } {
        if (!this.#trimmedIndices) {
            const segments = this.getSegments();
            let start = 0;
            let end = segments.length - 1;

            while (start <= end && isWhitespace(segments[start]?.segment)) start++;
            while (end >= start && isWhitespace(segments[end]?.segment)) end--;

            this.#trimmedIndices = { start, end };
        }
        return this.#trimmedIndices;
    }

    /**
     * Chops off and returns an integer from the start of the string
     * @returns A Result containing the parsed integer and updated StringView
     */
    public chopInt(): Result<number> {
        let result = 0;
        let sign = 1;
        let i = 0;
        const str = this.data;

        if (str[i] === '-') {
            sign = -1;
            i++;
        } else if (str[i] === '+') {
            i++;
        }

        let foundDigit = false;
        for (; i < str.length; i++) {
            const char = str[i];
            if (!char) throw new Error('Unexpected end of string');
            if (!isDigit(char)) break;
            result = result * 10 + (char.charCodeAt(0) - 48);
            foundDigit = true;
        }

        if (!foundDigit) {
            return StringView.getResult(false);
        }

        this.#start += i;
        this.#size -= i;
        return StringView.getResult(true, result * sign);
    }

    /**
     * Chops off and returns a float from the start of the string
     * @returns A Result containing the parsed float and updated StringView
     */
    public chopFloat(): Result<number> {
        let sign = 1;
        let i = 0;
        const str = this.data;

        // Handle sign
        if (str[i] === '-') {
            sign = -1;
            i++;
        } else if (str[i] === '+') {
            i++;
        }

        // Parse integer part
        let intPart = 0;
        let foundDigit = false;
        while (i < str.length && isDigit(str[i])) {
            intPart = intPart * 10 + (str.charCodeAt(i) - 48);
            foundDigit = true;
            i++;
        }

        // Parse decimal part
        let fracPart = 0;
        let fracDiv = 1;
        if (i < str.length && str[i] === '.') {
            i++;
            while (i < str.length && isDigit(str[i])) {
                fracPart = fracPart * 10 + (str.charCodeAt(i) - 48);
                fracDiv *= 10;
                foundDigit = true;
                i++;
            }
        }

        if (!foundDigit) {
            return StringView.getResult(false);
        }

        // Update the view
        const result = sign * (intPart + fracPart / fracDiv);
        this.#start += i;
        this.#size -= i;
        return StringView.getResult(true, result);
    }

    /**
     * Resets the StringView with new content or resets to initial state
     * @param newSource - Optional new source string. If not provided, resets to start of current source
     */
    public reset(newSource?: string): void {
        if (newSource !== undefined) {
            this.#source = newSource;
            this.#size = newSource.length;
        }
        this.#start = 0;
        this.#size = newSource?.length ?? this.#source.length;
        // Reset all caches
        this.#segmenter = undefined;
        this.#segments = undefined;
        this.#lengthInGraphemes = undefined;
        this.#trimmedIndices = undefined;
    }

    public dispose(): void {
        this.#segments = undefined;
        this.#segmenter = undefined;
        this.#lengthInGraphemes = undefined;
        this.#trimmedIndices = undefined;
    }

    // And a static cleanup method
    public static cleanup(): void {
        StringView.resultPool.length = 0;
    }

    // Add static result pool
    private static resultPool: Result<unknown>[] = [];

    private static getResult<T>(success: boolean, data?: T): Result<T> {
        const result = StringView.resultPool.pop() || { success: false, data: undefined };
        result.success = success;
        result.data = data;
        return result as Result<T>;
    }

    /**
     * Protected method to get internal state
     * @internal
     */
    protected getInternalState(): { source: string; start: number; size: number } {
        return {
            source: this.#source,
            start: this.#start,
            size: this.#size,
        };
    }

    /**
     * Copies state from another StringView instance
     * @param other - The StringView to copy from
     */
    public copyFrom(other: StringView): void {
        const state = other.getInternalState();
        this.#source = state.source;
        this.#start = state.start;
        this.#size = state.size;
        // Reset all caches since we're changing the view
        this.#segmenter = undefined;
        this.#segments = undefined;
        this.#lengthInGraphemes = undefined;
        this.#trimmedIndices = undefined;
    }
}
