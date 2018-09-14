#!/usr/bin/env bash

word="1"
#rm -rf ./content/*
find ./content/ -type f -name -not '.gitignore' -delete
node ipaustralia-grabber.js --word="$word"
node ipaustralia-parser.js
