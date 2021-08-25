
import { analyse, load, transform } from "./index";

async function main() {
    for (const filename of process.argv.slice(2)) {
        const doc = await load(filename);
        const details = analyse(doc);
        const code = transform(details);
        console.log(code);
    }
}

main();
