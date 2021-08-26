#!/usr/bin/env node

const { load, analyse, transform } = require("../lib");

async function main() {
  for (const filename of process.argv.slice(2)) {
    const doc = await load(filename);
    const details = analyse(doc);
    console.log(transform(details));
  }
}

main();
