
import { 
    isReferenceObject,
    OperationObject,
    Parameter,
    OpenAPI2,
    isMethod,
} from "./openapi";
import { Schema } from "./schema";

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
    // make sure it's v3
    if (doc.openapi !== "3.0.0") {
        throw new Error(`unsupported openapi version: ${doc.openapi ?? "missing"}`);
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
            const params = new OperationParams(operation);

            console.log(params);

            for (const param of item.parameters ?? []) {
                params.addParameter(param);
            }
            details.operations.push({ path, method, params, obj: operation });
        }
    }
    return details;
}

/**
 * A class to organize the separate groups of parameters.
 */
export class OperationParams {

    query    = new Schema("empty");
    path     = new Schema("empty");
    header   = new Schema("empty");
    body     = new Schema("empty");
    response = new Schema("empty");
    skipped: Parameter[] = [];

    constructor(op: OperationObject) {
        // request body
        const body = op.requestBody?.content?.["application/json"];
        if (body?.schema) {
            this.body = Schema.fromSchema(body.schema);
        }
        // request parameters
        for (const param of op.parameters ?? []) {
            this.addParameter(param);
        }
        // response data
        const res = op.responses?.["default"] ?? op.responses?.["200"];
        if (res) {
            this.response = Schema.fromRes(res);
        }
    }

    /**
     * Add a parameter to its corresponding schema.
     * Parameters which are $refs or have no names are skipped.
     */
    addParameter(param: Parameter): void {
        if (isReferenceObject(param) || !param.name) {
            this.skipped.push(param);
            return;
        }
        switch (param.in) {
            case "query":
                this.query.setParameter(param);
                break;
            case "path":
                this.path.setParameter(param);
                break;
            case "header":
                this.header.setParameter(param);
                break;
            default:
                this.skipped.push(param);
        }
    }
}
