// Advent of Code - Day 9 - Part Two

import { expandDiskMap, checksum, type DiskMap } from "./part1";

function createDiskMap(numbers: number[]) {
    const disk: Array<number | "."> = [];
    let fileId = 0;

    for (let i = 0; i < numbers.length; i++) {
        const length = numbers[i];

        if (i % 2 === 0) {
            for (let j = 0; j < length; j++) {
                disk.push(fileId);
            }
            fileId++;
        } else {
            for (let j = 0; j < length; j++) {
                disk.push(".");
            }
        }
    }

    return disk;
}

function findFiles(disk: Array<number | ".">) {
    const files = new Map<number, { id: number; start: number; length: number }>();

    for (let i = 0; i < disk.length; i++) {
        const id = disk[i];
        if (id === ".") continue;

        if (!files.has(id)) {
            files.set(id, {
                id,
                start: i,
                length: 1,
            });
        } else {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            files.get(id)!.length++;
        }
    }

    return Array.from(files.values());
}

function findFreeSpace(disk: Array<number | ".">, start: number, length: number) {
    let currentLength = 0;
    let currentStart = -1;

    for (let i = 0; i < start; i++) {
        if (disk[i] === ".") {
            if (currentStart === -1) currentStart = i;
            currentLength++;

            if (currentLength === length) {
                return currentStart;
            }
        } else {
            currentLength = 0;
            currentStart = -1;
        }
    }

    return -1;
}

function moveFile(disk: Array<number | ".">, file: { id: number; start: number; length: number }, newStart: number) {
    for (let i = file.start; i < file.start + file.length; i++) {
        disk[i] = ".";
    }

    for (let i = 0; i < file.length; i++) {
        disk[newStart + i] = file.id;
    }
}

function compactDisk(disk: (number | '.')[]) {
    const files = findFiles(disk);
    files.sort((a, b) => b.id - a.id);

    for (const file of files) {
        const newPos = findFreeSpace(disk, file.start, file.length);
        if (newPos !== -1) {
            moveFile(disk, file, newPos);
        }
    }

    return disk;
}

function calculateChecksum(disk: (number | '.')[]) {
    return disk.reduce<number>((sum, fileId, pos) => {
        if (fileId === ".") return sum;
        return sum + pos * fileId;
    }, 0);
}

function solve(input: string) {
    const numbers = input.trim().split('').map(Number);
    const disk = createDiskMap(numbers);
    const compactedDisk = compactDisk([...disk]);
    return calculateChecksum(compactedDisk);
}

export function part2(input: string) {
    return solve(input);
}
