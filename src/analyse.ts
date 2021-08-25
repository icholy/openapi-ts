
import { 
    isReferenceObject,
    OperationObject,
    Parameter,
    OpenAPI2,
    isMethod,
} from "./openapi";
import { Schema } from "./schema";


/**
 * A class to organize the separate groups of parameters.
 */
export class OperationParams {

    query    = new Schema("void");
    path     = new Schema("void");
    header   = new Schema("void");
    formData = new Schema("void");
    body     = new Schema("void");
    response = new Schema("void");
    skipped: Parameter[] = [];

    constructor(op: OperationObject) {
        // request parameters
        for (const param of op.parameters ?? []) {
            this.addParameter(param);
        }
        // response data
        if (op.responses?.["200"]) {
            this.response = Schema.fromRes(op.responses["200"]);
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
            case "body":
                if (param.name === "body") {
                    this.body = Schema.fromParam(param);
                } else {
                    this.body.setParameter(param);
                }
                break;
            case "query":
                this.query.setParameter(param);
                break;
            case "path":
                this.path.setParameter(param);
                break;
            case "header":
                this.header.setParameter(param);
                break;
            case "formData":
                this.formData.setParameter(param);
                break;
            default:
                this.skipped.push(param);
        }
    }
}

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