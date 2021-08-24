#!/usr/bin/env node

const { load, transform } = require("../lib");

async function main() {
    for (const filename of process.argv.slice(2)) {
        const doc = await load(filename);
        const code = await transform(doc);
        console.log(code);
    }
}

main();