/**
 * Represents a node in a Trie data structure.
 * Each node contains a map of children nodes and a flag indicating if it represents the end of a word.
 */
export class TrieNode {
    private children: Map<string, TrieNode>;
    private isEndOfWord: boolean;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }

    /**
     * Retrieves a child node for the given character.
     * @param char - The character to look up
     * @returns The child node if it exists, undefined otherwise
     */
    public getChild(char: string): TrieNode | undefined {
        return this.children.get(char);
    }

    /**
     * Adds a new child node for the given character.
     * @param char - The character to add a node for
     * @returns The newly created node
     */
    public addChild(char: string): TrieNode {
        const node = new TrieNode();
        this.children.set(char, node);
        return node;
    }

    /**
     * Checks if a child node exists for the given character.
     * @param char - The character to check
     * @returns True if a child exists for the character, false otherwise
     */
    public hasChild(char: string): boolean {
        return this.children.has(char);
    }

    /**
     * Returns all children nodes.
     * @returns Map of characters to their corresponding nodes
     */
    public getChildren(): Map<string, TrieNode> {
        return this.children;
    }

    /**
     * Sets whether this node represents the end of a word.
     * @param isEnd - Boolean indicating if this node is the end of a word
     */
    public setEndOfWord(isEnd: boolean): void {
        this.isEndOfWord = isEnd;
    }

    /**
     * Checks if this node represents the end of a word.
     * @returns True if this node is the end of a word, false otherwise
     */
    public isEnd(): boolean {
        return this.isEndOfWord;
    }
}

/**
 * A Trie (prefix tree) data structure for efficient string operations.
 * Supports insertion, search, prefix matching, and retrieval of all words with a given prefix.
 *
 * @example
 * ```typescript
 * const trie = new Trie();
 * trie.insert("hello");
 * trie.insert("help");
 *
 * console.log(trie.search("hello")); // true
 * console.log(trie.startsWith("hel")); // true
 * console.log(trie.findAllWithPrefix("hel")); // ["hello", "help"]
 * ```
 */
export class Trie {
    private root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Inserts a word into the trie.
     * @param word - The word to insert
     * @example
     * ```typescript
     * const trie = new Trie();
     * trie.insert("hello");
     * ```
     */
    public insert(word: string): void {
        let current = this.root;

        for (const char of word) {
            if (!current.hasChild(char)) {
                current = current.addChild(char);
            } else {
                // biome-ignore lint/style/noNonNullAssertion: We know the child exists
                current = current.getChild(char)!;
            }
        }

        current.setEndOfWord(true);
    }

    /**
     * Searches for a complete word in the trie.
     * @param word - The word to search for
     * @returns True if the exact word exists in the trie, false otherwise
     * @example
     * ```typescript
     * const trie = new Trie();
     * trie.insert("hello");
     * console.log(trie.search("hello")); // true
     * console.log(trie.search("hell")); // false
     * ```
     */
    public search(word: string): boolean {
        const node = this.traverse(word);
        return node?.isEnd() ?? false;
    }

    /**
     * Checks if any word in the trie starts with the given prefix.
     * @param prefix - The prefix to search for
     * @returns True if any word starts with the prefix, false otherwise
     * @example
     * ```typescript
     * const trie = new Trie();
     * trie.insert("hello");
     * console.log(trie.startsWith("hel")); // true
     * console.log(trie.startsWith("world")); // false
     * ```
     */
    public startsWith(prefix: string): boolean {
        return this.traverse(prefix) !== undefined;
    }

    /**
     * Finds all words in the trie that start with the given prefix.
     * @param prefix - The prefix to search for
     * @returns Array of all words that start with the prefix
     * @example
     * ```typescript
     * const trie = new Trie();
     * trie.insert("hello");
     * trie.insert("help");
     * console.log(trie.findAllWithPrefix("hel")); // ["hello", "help"]
     * ```
     */
    public findAllWithPrefix(prefix: string): string[] {
        const results: string[] = [];
        const node = this.traverse(prefix);

        if (node) {
            this.dfs(node, prefix, results);
        }

        return results;
    }

    /**
     * Traverses the trie following the given string.
     * @param str - The string to traverse
     * @returns The last node in the path, or undefined if the path doesn't exist
     * @private
     */
    private traverse(str: string): TrieNode | undefined {
        let current = this.root;

        for (const char of str) {
            if (!current.hasChild(char)) {
                return undefined;
            }
            // biome-ignore lint/style/noNonNullAssertion: We know the child exists
            current = current.getChild(char)!;
        }

        return current;
    }

    /**
     * Performs a depth-first search starting from the given node to find all complete words.
     * @param node - The starting node
     * @param prefix - The prefix accumulated up to this node
     * @param results - Array to store found words
     * @private
     */
    private dfs(node: TrieNode, prefix: string, results: string[]): void {
        if (node.isEnd()) {
            results.push(prefix);
        }

        for (const [char, childNode] of node.getChildren()) {
            this.dfs(childNode, prefix + char, results);
        }
    }
}
