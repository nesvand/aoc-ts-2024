// Advent of Code - Day 9 - Part One

import { chunk } from "@lib/array";

export type DiskMap = Array<number | '.'>;

export function expandDiskMap(diskMap: Array<number>): DiskMap {
    const disk: DiskMap = [];
    for (const [fileId, [size, free]] of chunk(diskMap, 2).entries()) {
        for (let i = 0; i < (size ?? 0); i++) {
            disk.push(fileId);
        }
        for (let i = 0; i < (free ?? 0); i++) {
            disk.push('.');
        }
    }

    return disk;
}

export function compressDisk(disk: DiskMap): DiskMap {
    while (true) {
        const free = disk.indexOf('.');
        if (free === -1) break;

        let endPos = disk.length - 1;
        while (endPos >= 0 && disk[endPos] === '.') {
            endPos--;
        }

        // Contiguous free space at the end of the disk
        if (endPos <= free) break;

        disk[free] = disk[endPos];
        disk[endPos] = '.';
    }
    return disk;
}

export function checksum(disk: DiskMap): number {
    return disk.reduce<number>((sum, fileId, idx) => {
        if (fileId === '.') return sum;
        return sum + idx * fileId;
    }, 0);
}

export function part1(input: string): number {
    const initialDiskMap = input.trim().split('').map(Number);
    const disk = expandDiskMap(initialDiskMap);
    const compressed = compressDisk([...disk]);
    return checksum(compressed);
}
