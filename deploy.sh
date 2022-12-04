#!/usr/bin/env sh

set -e

bun run build

cd dist

echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m "deploy"

git push -f https://github.com/naturecodevoid/weather.naturecodevoid.dev.git main:gh-pages

cd -
