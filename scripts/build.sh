#!/usr/bin/env bash

esbuild src/index.js --outfile=index.cjs --format=cjs --bundle --target=node16
esbuild src/index.js --outfile=index.mjs --format=esm --bundle --target=node16
tsc src/index.js --declaration --allowJs --emitDeclarationOnly --outDir .
