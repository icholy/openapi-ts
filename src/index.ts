
import ts from "typescript";
import fs from "fs";
import prettier from "prettier";
import fetch from "node-fetch";
import { OpenAPI2, isMethod, OperationObject } from "./openapi";
import { OperationParams } from "./operations";
import { Schema } from "./schema";
import { inferOperationName, toRequestSchema } from "./name";
import { TypeScriptPrinter } from "./printer";

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
    const printer = new TypeScriptPrinter();
    // definitions
    for (const [name, schema] of Object.entries(doc.definitions)) {
        printer.schema(schema, name);
    }
    // routes
    for (const { params, method, path } of doc.operations) {
        const name = inferOperationName(method, path);
        for (const skipped of params.skipped) {
            console.warn("SKIPPED", skipped);
        }
        printer.schema(params.path, `${name.pascal}Path`);
        printer.schema(params.query, `${name.pascal}Query`);
        printer.schema(params.body, `${name.pascal}Body`);
        printer.schema(params.response, `${name.pascal}Response`);
        printer.schema(toRequestSchema(name), `${name.pascal}Request`);
    }
    return printer.code();
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