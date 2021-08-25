
import fs from "fs";
import fetch from "node-fetch";
import { OpenAPI2 } from "./openapi";
import { DocumentDetails, analyse, OperationDetails } from "./analyse";
import { TypeScriptPrinter } from "./printer";
import { Schema } from "./schema";
import prettier from "prettier";

/**
 * Main entry point.
 */
 export async function main() {
    for (const filename of process.argv.slice(2)) {
        const doc = await load(filename);
        const details = analyse(doc);
        const code = transform(details);
        console.log(code);
    }
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

/**
 * Generate typescript code from the document details.
 */
 export function transform(doc: DocumentDetails): string {
    const print = new TypeScriptPrinter();
    // definitions
    for (const [name, schema] of Object.entries(doc.definitions)) {
        print.schema(schema, name);
        print.blank();
    }
    // routes
    for (const details of doc.operations) {
        const { params, method, path } = details;
        const name = inferName(method, path);
        for (const skipped of params.skipped) {
            console.warn("SKIPPED", skipped);
        }
        // path parameters
        print.schema(params.path, `${name.pascal}Path`);
        print.blank();
        // query parameters
        print.schema(params.query, `${name.pascal}Query`);
        print.blank();
        // body
        print.schema(params.body, `${name.pascal}Body`);
        print.blank();
        // response
        print.schema(params.response, `${name.pascal}Response`);
        print.blank();
        // server request
        print.schema(toRequestSchema(name, details), `${name.pascal}Request`);
        print.blank();
    }
    // improve formatting
    const code = print.code();
    return prettier.format(code, { parser: "babel", printWidth: 100 });
}

/**
 * The method and path combined into snake and pascal style names.
 */
export interface OperationName {
    snake: string;  // used for method names
    pascal: string; // used for type names
}

/**
 * Infer the operation name from the method and parameter.
 */
export function inferName(method: string, path: string): OperationName {
    if (path.endsWith(".json")) {
        path = path.slice(0, -5);
    }
    const path_segments = path.split("/").filter(segment => {
        return segment != "" && !segment.includes("{");
    });
    const parts = [method.toLowerCase(), ...path_segments];
    return {
        snake: parts.join("_"),
        pascal: parts.map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(''),
    };
}

/**
 * Create a Response type by combining the Query, Path, and Body types.
 */
export function toRequestSchema(name: OperationName, details: OperationDetails): Schema {
    const request = new Schema("void");
    if (details.params.query.type !== "void") {
        request.merge(new Schema(`${name.pascal}Query`));
    }
    if (details.params.path.type !== "void") {
        request.merge(new Schema(`${name.pascal}Path`));
    }
    if (details.params.body.type !== "void") {
        const body = new Schema(`${name.pascal}Body`);
        body.required = true;
        request.setProperty("body", body);
    }
    return request;
}

