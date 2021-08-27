
import fs from "fs";
import fetch from "node-fetch";
import { OpenAPI2 } from "./openapi";
import { DocumentDetails, analyse, OperationDetails } from "./analyse";
import { Printer } from "./printer";
import { Schema } from "./schema";
import prettier from "prettier";

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
    const print = new Printer();
    // definitions
    for (const [name, schema] of Object.entries(doc.definitions)) {
        print.schema(schema, name);
        print.blank();
    }
    // routes
    for (const details of doc.operations) {
        const { params, method, path } = details;
        const prefix = createPrefix(method, path);
        for (const skipped of params.skipped) {
            console.warn("SKIPPED", skipped);
        }
        print.comment(`${method.toUpperCase()} ${path}`);
        print.blank();
        // path parameters
        if (!params.path.isVoid()) {
            print.schema(params.path, `${prefix}Path`);
            print.blank();
        }
        // query parameters
        if (!params.query.isVoid()) {
            print.schema(params.query, `${prefix}Query`);
            print.blank();
        }
        // body
        if (!params.body.isVoid()) {
            print.schema(params.body, `${prefix}Body`);
            print.blank();
        }
        // response
        print.schema(params.response, `${prefix}Response`);
        print.blank();
    }
    // improve formatting
    const code = print.code();
    return prettier.format(code, { parser: "babel", printWidth: 100 });
}

/**
 * Convert the method and path into a pascal case prefix used for the generated types.
 */
function createPrefix(method: string, path: string): string {
    if (path.endsWith(".json")) {
        path = path.slice(0, -5);
    }
    const path_segments = path.split("/").filter(segment => {
        return segment != "" && !segment.includes("{");
    });
    const parts = [method.toLowerCase(), ...path_segments];
    return parts.map(s => s.charAt(0).toUpperCase() + s.substr(1)).join('');
}
