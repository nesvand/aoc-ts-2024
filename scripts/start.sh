#!/usr/bin/env bash
set -xe

DAY=$1
bun "./src/${DAY}/main.ts"
