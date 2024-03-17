#! /bin/bash

git checkout main && git pull && git checkout -b deploy

yarn build

cp src/index.html src/*.js  src/*.css .

git push --force

fi
