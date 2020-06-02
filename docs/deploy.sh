#!/usr/bin/env sh

set -e

yarn docs:build

cp docs/CNAME docs/.vuepress/dist/CNAME

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:vuex-orm/vuex-orm.git master:gh-pages

cd -
