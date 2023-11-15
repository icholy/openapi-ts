import { OpenAPIV3 } from 'openapi-types';
import { 
    isReferenceObject,
    isMethod,
} from "./openapi";
import { Schema } from "./schema";

/**
 * Analysed document
 */
 export interface DocumentDetails {
    schemas: Record<string, Schema>;
    operations: OperationDetails[];
}

/**
 * Analysed operation.
 */
export interface OperationDetails {
    path: string;
    method: string;
    params: OperationParams;
    obj: OpenAPIV3.OperationObject;
}

/**
 * Analyse an openapi v3 document and find all definitions and operation schemas.
 */
 export function analyse(doc: OpenAPIV3.Document): DocumentDetails {
    // make sure it's v3
    if (doc.openapi !== "3.0.0") {
        throw new Error(`unsupported openapi version: ${doc.openapi ?? "missing"}`);
    }
    const details: DocumentDetails = {
        schemas: {},
        operations: [],
    };
    // definitions
    for (const [name, schema] of Object.entries(doc.components?.schemas ?? {})) {
        details.schemas[name] = Schema.fromSchema(schema);
    }
    // routes
    for (const [pattern, item] of Object.entries(doc.paths ?? {})) {
        if (!item) {
            continue;
        }
        for (const method of Object.keys(item)) {
            if (!isMethod(method)) {
                continue;
            }
            const operation = item[method]!;
            const params = new OperationParams(operation, doc);
            for (const param of item.parameters ?? []) {
                params.addParameter(param);
            }
            details.operations.push({ path: pattern, method, params, obj: operation });
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
    skipped: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[] = [];

    constructor(op: OpenAPIV3.OperationObject, doc: OpenAPIV3.Document) {
        // request body
        if (op.requestBody) {
            this.body = Schema.fromRequestBody(op.requestBody, doc);
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
    addParameter(param: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): void {
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
