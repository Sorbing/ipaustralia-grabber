## Grabber from ipaustralia.gov.au

### Requirements

- Node v8+ with npm
- Google Chrome (or Chromium)
- Node modules: puppeteer, minimist, cheerio 

### Install

Run the script: `install.sh`
    
### Usage

Run the script: `grab.sh "abc"` or:

```
node ipaustralia-grabber.js --word="abc" # grab all result pages into ./content direcory 
node ipaustralia-parser.js               # parse all html results to JSON
```
