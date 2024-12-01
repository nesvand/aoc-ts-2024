# Trie Examples

A Trie (prefix tree) is perfect for string-based operations and prefix matching. Here are some practical examples:

## 1. Autocomplete System

Implement a word suggestion system:

```typescript
class AutocompleteSystem {
    private dictionary: Trie;

    constructor(words: string[]) {
        this.dictionary = new Trie();
        words.forEach(word => this.dictionary.insert(word));
    }

    public addWord(word: string): void {
        this.dictionary.insert(word);
    }

    public getSuggestions(prefix: string): string[] {
        return this.dictionary.findAllWithPrefix(prefix);
    }

    public isValidWord(word: string): boolean {
        return this.dictionary.search(word);
    }
}

// Usage:
const autocomplete = new AutocompleteSystem(["hello", "help", "held", "helmet"]);
console.log(autocomplete.getSuggestions("hel")); // ["hello", "help", "held", "helmet"]
console.log(autocomplete.isValidWord("help")); // true
```

## 2. URL Router

Implement a simple URL routing system:

```typescript
class URLRouter {
    private routes: Trie;

    constructor() {
        this.routes = new Trie();
    }

    public addRoute(path: string, handler: string): void {
        this.routes.insert(path);
    }

    public findMatchingRoutes(pathPrefix: string): string[] {
        return this.routes.findAllWithPrefix(pathPrefix);
    }

    public exactMatch(path: string): boolean {
        return this.routes.search(path);
    }
}

// Usage:
const router = new URLRouter();
router.addRoute("/api/users");
router.addRoute("/api/users/profile");
router.addRoute("/api/products");
console.log(router.findMatchingRoutes("/api/")); // ["/api/users", "/api/users/profile", "/api/products"]
```

## 3. Contact List

Implement a searchable contact list:

```typescript
class ContactList {
    private contacts: Trie;
    private contactData: Map<string, { phone: string, email: string }>;

    constructor() {
        this.contacts = new Trie();
        this.contactData = new Map();
    }

    public addContact(name: string, phone: string, email: string): void {
        this.contacts.insert(name.toLowerCase());
        this.contactData.set(name.toLowerCase(), { phone, email });
    }

    public searchContacts(prefix: string): string[] {
        return this.contacts.findAllWithPrefix(prefix.toLowerCase());
    }

    public getContactDetails(name: string): { phone: string, email: string } | undefined {
        return this.contactData.get(name.toLowerCase());
    }
}

// Usage:
const contacts = new ContactList();
contacts.addContact("John Doe", "123-456-7890", "john@example.com");
contacts.addContact("Jane Doe", "098-765-4321", "jane@example.com");
console.log(contacts.searchContacts("jo")); // ["john doe"]
```

## 4. Command Line Interface

Implement command suggestions for a CLI:

```typescript
class CommandSuggester {
    private commands: Trie;
    private commandHelp: Map<string, string>;

    constructor() {
        this.commands = new Trie();
        this.commandHelp = new Map();
    }

    public addCommand(command: string, helpText: string): void {
        this.commands.insert(command);
        this.commandHelp.set(command, helpText);
    }

    public suggestCommands(prefix: string): string[] {
        return this.commands.findAllWithPrefix(prefix);
    }

    public getHelpText(command: string): string | undefined {
        return this.commandHelp.get(command);
    }
}

// Usage:
const cli = new CommandSuggester();
cli.addCommand("git-commit", "Commit changes to the repository");
cli.addCommand("git-push", "Push changes to remote");
cli.addCommand("git-pull", "Pull changes from remote");
console.log(cli.suggestCommands("git-")); // ["git-commit", "git-push", "git-pull"]
```

Key Benefits:
1. Fast prefix-based searches
2. Memory-efficient storage of strings
3. Quick word lookup
4. Natural prefix matching
5. Autocomplete functionality

Common Use Cases:
- Autocomplete systems
- Spell checkers
- IP routing tables
- Phone directories
- Dictionary implementations
- Command line interfaces
- URL routing
- Word games 