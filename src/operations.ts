
import { 
    isReferenceObject,
    OperationObject,
    Parameter,
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
