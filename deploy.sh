#! /bin/bash

git checkout main && git pull && git checkout -b deploy

yarn build

cp src/index.html src/*.js  src/*.css .

git add . && git commit -m "deploy"

git push --set-upstream origin deploy --force
