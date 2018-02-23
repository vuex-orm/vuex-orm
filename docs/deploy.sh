#!/bin/bash

if [ -d _book ]; then
  rm -rf _book
fi

gitbook install

gitbook build

cd _book

git init

git add -A

git commit -m 'Update docs'

git push -f git@github.com:vuex-orm/vuex-orm.git master:gh-pages
