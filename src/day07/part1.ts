// Advent of Code - Day 7 - Part One

import { StringView } from "@lib/string-view";

function generateListOfOperators(n: number): string[][] {
    const initialList: string[][] = [['+'], ['*']]
    while (!initialList.every((l) => l.length === n)) {
        const l = initialList.shift();
        if (l === undefined) throw new Error('Failed to generate list of operators');
        const copy = l.slice();
        l.push('+');
        copy.push('*');
        initialList.push(copy);
        initialList.push(l);
    }
    return initialList;
}

export function part1(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n').filter(Boolean)
        .map((line) => {
            const sv = new StringView(line);
            const answer = sv.chopInt();
            if (!answer.success) throw new Error('Failed to parse answer');
            sv.chopLeft(2);
            const parts: number[] = [];
            let part = sv.chopInt();
            while (part.success) {
                parts.push(part.data);
                sv.chopLeft(1);
                part = sv.chopInt();
            }
            return { answer: answer.data, parts };
        });
    let finalResult = 0;
    for (const { answer, parts } of items) {
        const numberOfOperators = parts.length - 1;
        if (numberOfOperators === 0) throw new Error('Unexpected number of operators');
        if (numberOfOperators === 1) {
            const [a, b] = parts;
            if (a + b === answer) {
                finalResult += answer;
                continue;
            }
            if (a * b === answer) {
                finalResult += answer;
                continue;
            }
            // invalid, skip
            continue;
        }
        const operatorList = generateListOfOperators(numberOfOperators);
        for (const operators of operatorList) {
            let result = 0;
            for (const [i, operator] of operators.entries()) {
                if (i === 0) {
                    result = parts[0];
                }
                const next = parts[i + 1];
                switch (operator) {
                    case '+':
                        result += next;
                        break;
                    case '*':
                        result *= next;
                        break;
                }
            }
            if (result === answer) {
                finalResult += answer;
                break;
            }
        }
    }
    return finalResult;
}
