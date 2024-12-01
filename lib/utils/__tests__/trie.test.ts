import { describe, expect, test } from 'bun:test';
import { Trie } from '@lib/data';

describe('Trie', () => {
    test('should insert and search words', () => {
        const trie = new Trie();
        trie.insert('hello');

        expect(trie.search('hello')).toBe(true);
        expect(trie.search('hell')).toBe(false);
        expect(trie.search('hello!')).toBe(false);
    });

    test('should check prefix existence', () => {
        const trie = new Trie();
        trie.insert('hello');

        expect(trie.startsWith('hel')).toBe(true);
        expect(trie.startsWith('hello')).toBe(true);
        expect(trie.startsWith('hell!')).toBe(false);
    });

    test('should find all words with prefix', () => {
        const trie = new Trie();
        trie.insert('hello');
        trie.insert('hell');
        trie.insert('help');
        trie.insert('world');

        expect(trie.findAllWithPrefix('hel')).toEqual(['hell', 'hello', 'help']);
        expect(trie.findAllWithPrefix('wo')).toEqual(['world']);
        expect(trie.findAllWithPrefix('xyz')).toEqual([]);
    });

    test('should handle empty strings', () => {
        const trie = new Trie();
        trie.insert('');

        expect(trie.search('')).toBe(true);
        expect(trie.startsWith('')).toBe(true);
        expect(trie.findAllWithPrefix('')).toEqual(['']);
    });

    test('should handle case sensitivity', () => {
        const trie = new Trie();
        trie.insert('Hello');

        expect(trie.search('hello')).toBe(false);
        expect(trie.search('Hello')).toBe(true);
        expect(trie.startsWith('hel')).toBe(false);
        expect(trie.startsWith('Hel')).toBe(true);
    });
});
