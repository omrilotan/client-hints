#!/usr/bin/env bash

failures=0

esbuild src/index.ts --outfile=index.cjs --format=cjs --bundle --sourcemap
failures=$((failures + $?))

esbuild src/index.ts --outfile=index.mjs --format=esm --bundle --sourcemap
failures=$((failures + $?))

tsc src/index.ts --declaration --emitDeclarationOnly --declarationMap --outDir types --target esnext --moduleResolution node
failures=$((failures + $?))

mv types/index.d.ts .
mv types/index.d.ts.map .
rm -rf types

exit $failures
