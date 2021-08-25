
import ts from "typescript";
import fs from "fs";
import prettier from "prettier";
import fetch from "node-fetch";
import { OpenAPI2, isMethod, OperationObject } from "./openapi";
import { OperationParams } from "./operations";
import { Schema } from "./schema";
import { inferOperationName, toRequestSchema } from "./name";

/**
 * Analysed document
 */
 export interface DocumentDetails {
    definitions: Record<string, Schema>;
    operations: OperationDetails[];
}

/**
 * Analysed operation.
 */
export interface OperationDetails {
    path: string;
    method: string;
    params: OperationParams;
    obj: OperationObject;
}

/**
 * Analyse an openapi v2 document and find all definitions and operation schemas.
 */
 export function analyse(doc: OpenAPI2): DocumentDetails {
    // make sure it's v2
    if (doc.swagger !== "2.0") {
        throw new Error(`unsupported swagger version: ${doc.swagger ?? "missing"}`);
    }
    const details: DocumentDetails = {
        definitions: {},
        operations: [],
    };
    // definitions
    for (const [name, schema] of Object.entries(doc.definitions ?? {})) {
        details.definitions[name] = Schema.fromSchema(schema);
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
            const params = new OperationParams(operation);
            for (const param of item.parameters ?? []) {
                params.addParameter(param);
            }
            details.operations.push({ path, method, params, obj: operation });
        }
    }
    return details;
}

/**
 * Generate typescript code from the document details.
 */
export function transform(doc: DocumentDetails): string {
    const emitted: string[] = [];
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
    for (const [name, schema] of Object.entries(doc.definitions)) {
        emit(schema.toTypeDeclaration(name));
    }
    // routes
    for (const { params, method, path } of doc.operations) {
        const name = inferOperationName(method, path);
        for (const skipped of params.skipped) {
            console.warn("SKIPPED", skipped);
        }
        emit(params.path.toTypeDeclaration(`${name.pascal}Path`));
        emit(params.query.toTypeDeclaration(`${name.pascal}Query`));
        emit(params.body.toTypeDeclaration(`${name.pascal}Body`));
        emit(params.response.toTypeDeclaration(`${name.pascal}Response`));
        emit(toRequestSchema(name).toTypeDeclaration(`${name.pascal}Request`));
    }
    return emitted.join("\n");
}

/**
 * Load a openapi v2 definition. 
 * If filename looks like a url, it will try to fetch it.
 */
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