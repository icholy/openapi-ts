
import ts from "typescript";
import fs from "fs";
import prettier from "prettier";
import ejs from "ejs";
import fetch from "node-fetch";
import { OpenAPI2, isMethod } from "./openapi";
import { findDefinitionSchemas, OperationSchemas } from "./operations";
import { inferOperationName, toRequestInterface } from "./name";

async function load(filename: string): Promise<OpenAPI2> {
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
        const res = await fetch(filename);
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return JSON.parse(await res.text());
    }
    const data = await fs.promises.readFile(filename, "utf-8");
    return JSON.parse(data);
}

async function main() {
    for (const filename of process.argv.slice(2)) {
        // read the spec
        const doc = await load(filename);
        // read the template
        const template = ejs.compile(
            await fs.promises.readFile("template.ejs", "utf-8"));
        // setup typescript
        const printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed,
            noEmitHelpers: true,
        });
        const output = ts.createSourceFile(
            "definitions.ts",
            "",
            ts.ScriptTarget.Latest,
            false,
            ts.ScriptKind.TS,
        );
        const emit = (node: ts.Node) => {
            const code = printer.printNode(ts.EmitHint.Unspecified, node, output);
            console.log(prettier.format(code, { parser: "babel" }));
        }
        // definitions
        const defs = findDefinitionSchemas(doc);
        for (const [name, schema] of Object.entries(defs)) {
            emit(schema.toTypeDeclaration(name));
        }
        // routes
        for (const path of Object.keys(doc.paths ?? {})) {
            const item = doc.paths?.[path] ?? {};
            for (const method of Object.keys(item)) {
                if (!isMethod(method)) {
                    continue;
                }
                const operation = doc.paths?.[path]?.[method] ?? {};
                if (operation.deprecated) {
                    continue;
                }
                const name = inferOperationName(method, path);
                const schemas = new OperationSchemas();
                schemas.addOperationSchemas(operation);
                for (const param of item.parameters ?? []) {
                    schemas.addParameter(param);
                }
                for (const skipped of schemas.skipped) {
                    console.warn("SKIPPED", skipped);
                }
                emit(schemas.path.toTypeDeclaration(`${name.pascal}Path`));
                emit(schemas.query.toTypeDeclaration(`${name.pascal}Query`));
                emit(schemas.body.toTypeDeclaration(`${name.pascal}Body`));
                emit(schemas.response.toTypeDeclaration(`${name.pascal}Response`));
                emit(toRequestInterface(name));

                // console.log(template({ name, method, url: path }));
            }
        }
    }
}

main();
