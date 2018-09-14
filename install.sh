#!/usr/bin/env bash

chmod -R 777 ./content/

if ! [[ $(node -v) =~ v8 ]]; then
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs build-essential
fi

#npm install --ignore-scripts puppeteer
npm install
