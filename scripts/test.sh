#!/usr/bin/env bash
set -xe

DAY=$1
if [ -z "$DAY" ]; then
    bun test
else
    bun test "./test/${DAY}.test.ts"
fi
