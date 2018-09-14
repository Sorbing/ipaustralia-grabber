#!/usr/bin/env bash

script_name=$(basename "$0")
word="$1"

[[ -z $word ]] && { echo -e "Not specified the word text!\nExample usage:\n$script_name \"abc\""; exit 1; }
find ./content -type f -not -name '.gitignore' -exec rm {} +
node ipaustralia-grabber.js --word="$word"
node ipaustralia-parser.js
