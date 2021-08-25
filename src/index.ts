
import ts from "typescript";
import fs from "fs";
import prettier from "prettier";
import ejs from "ejs";
import fetch from "node-fetch";
import { OpenAPI2, isMethod } from "./openapi";
import { findDefinitionSchemas, OperationSchemas } from "./operations";
import { inferOperationName, toRequestSchema } from "./name";

export async function load(filename: string): Promise<OpenAPI2> {
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
        const res = await fetch(filename);
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return await res.json();
    }
    const data = await fs.promises.readFile(filename, "utf-8");
    return JSON.parse(data);
}

export function transform(doc: OpenAPI2): string {
    const emitted: string[] = [];
    // make sure it's v2
    if (doc.swagger !== "2.0") {
        throw new Error(`unsupported swagger version: ${doc.swagger ?? "missing"}`);
    }
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
        emitted.push(prettier.format(code, { parser: "babel", printWidth: 100 }));
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
            emit(toRequestSchema(name).toTypeDeclaration(`${name.pascal}Request`));
        }
    }
    return emitted.join("\n");
}
