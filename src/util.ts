import fs from "fs";
import fetch from "node-fetch";
import { OpenAPIV3 } from 'openapi-types';
import { DocumentDetails } from "./analyse";
import { Printer } from "./printer";
import prettier from "prettier";

/**
 * Load a openapi v3 definition.
 * If filename looks like a url, it will try to fetch it.
 */
export async function load(filename: string): Promise<OpenAPIV3.Document> {
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
    // component schemas
    for (const [name, schema] of Object.entries(doc.schemas)) {
        print.schema(schema, name);
        print.blank();
    }
    // routes
    for (const op of doc.operations) {
        const { params, method, path } = op;
        const prefix = createPrefix(method, path);
        for (const skipped of params.skipped) {
            console.warn("SKIPPED", skipped);
        }
        print.comment(`${method.toUpperCase()} ${path}`);
        print.blank();
        // header parameters
        if (!params.header.isEmpty()) {
            print.schema(params.header, `${prefix}Headers`);
            print.blank();
        }
        // path parameters
        if (!params.path.isEmpty()) {
            print.schema(params.path, `${prefix}Path`);
            print.blank();
        }
        // query parameters
        if (!params.query.isEmpty()) {
            print.schema(params.query, `${prefix}Query`);
            print.blank();
        }
        // body
        if (!params.body.isEmpty()) {
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
    const path_segments = path.split(/[\/\-_]/).filter(segment => {
        return segment != "" && !segment.includes("{");
    });
    const parts = [method.toLowerCase(), ...path_segments];
    return parts.map(s => s.charAt(0).toUpperCase() + s.substr(1)).join('');
}
