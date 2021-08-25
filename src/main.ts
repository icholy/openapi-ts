
import { load, transform } from "./index";

async function main() {
    for (const filename of process.argv.slice(2)) {
        const doc = await load(filename);
        const code = transform(doc);
        console.log(code);
    }
}

main();
