
import ts from "typescript";
import {
    isReferenceObject,
    ReferenceObject,
    SchemaObject,
    ParameterObject,
    ResponseObject,
} from "./openapi";

// the intermediate representation of a type
export class Schema {
    description = "";
    required = false;
    type: string;
    items?: Schema;
    properties: Record<string, Schema> = {};
    additional?: Schema;
    heritage: Schema[] = [];

    constructor(type: string = "object") {
        switch (type) {
            case "binary":
            case "byte":
            case "date":
            case "dateTime":
            case "password":
                type = "string";
                break;
            case "double":
            case "float":
            case "integer":
                type = "number";
                break;
        }
        this.type = type;
    }

    isEmpty(): boolean {
        return this.type === "object" && Object.keys(this.properties ?? {}).length === 0;
    }

    isRef() {
        switch (this.type) {
            case "string":
            case "number":
            case "boolean":
            case "array":
            case "object":
                return false;
            default:
                return true;
        }
    }

    extendWith(schema: Schema): void {
        if (schema.isRef()) {
            this.heritage.push(schema);
        } else {
            for (const [name, schema_] of Object.entries(schema.properties)) {
                this.setProperty(name, schema_);
            }
        }
    }

    setProperty(name: string, schema: Schema): void {
        if (this.type !== "object") {
            throw new Error(`cannot set property ${name} on ${this.type}`);
        }
        this.properties[name] = schema;
    }

    setParameter(param: ParameterObject): void {
        if (!param.name) {
            throw new Error('parameter must have name');
        }
        this.setProperty(param.name, Schema.fromParam(param));
    }

    toSignatures(): ts.TypeElement[] {
        const sigs: ts.TypeElement[] = Object.entries(this.properties).map(([name, schema]) => {
            const sig = ts.factory.createPropertySignature(
                undefined,
                ts.factory.createIdentifier(name),
                schema.required ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                schema.toTypeNode(),
            );
            if (schema.description) {
                return ts.addSyntheticLeadingComment(
                    sig,
                    ts.SyntaxKind.SingleLineCommentTrivia,
                    schema.description,
                    false,
                )
            }
            return sig;
        });
        if (this.additional) {
            sigs.push(
                ts.factory.createIndexSignature(
                    undefined,
                    undefined,
                    [ts.factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        ts.factory.createIdentifier("index"),
                        undefined,
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                        undefined
                    )],
                    this.additional.toTypeNode(),
                )
            );
        }
        return sigs;
    }

    toTypeNode(): ts.TypeNode {
        switch (this.type) {
            case "string":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case "number":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case "boolean":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case "array":
                let items: ts.TypeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                if (this.items) {
                    items = this.items.toTypeNode();
                }
                return ts.factory.createArrayTypeNode(items);
            case "object":
                const sigs = this.toSignatures();
                if (sigs.length === 0) {
                    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                }
                return ts.factory.createTypeLiteralNode(sigs);
            default:
                return ts.factory.createTypeReferenceNode(this.type);
        }
    }

    toTypeDeclaration(name: string): ts.Declaration {
        if (this.type === "object") {
            return ts.factory.createInterfaceDeclaration(
                [], // decorators
                [
                    ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
                ], // modifiers
                ts.factory.createIdentifier(name),
                [], // type parameters
                [], // heritage clause
                this.toSignatures(),
            );
        }
        return ts.factory.createTypeAliasDeclaration(
            [], // decorators,
            [
                ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
            ], // modifiers
            ts.factory.createIdentifier(name),
            [], // type parameters
            this.toTypeNode(),
        );
    }

    static fromRef(ref: ReferenceObject): Schema {
        const parts = ref.$ref.split("/");
        return new Schema(parts[parts.length - 1])
    }

    static fromSchema(obj: SchemaObject | ReferenceObject): Schema {
        if (isReferenceObject(obj)) {
            return Schema.fromRef(obj);
        }
        if (obj.allOf) {
            const union = new Schema();
            for (const obj_ of obj.allOf) {
                const schema_ = Schema.fromSchema(obj_);
                union.extendWith(schema_);
            }
            return union;
        }
        const schema = new Schema(obj.type);
        schema.description = obj.description ?? "";
        if (schema.type === "array") {
            schema.items = Schema.fromSchema(obj.items ?? {});
        }
        if (schema.type === "object") {
            const required = new Set(obj.required ?? []);
            for (const [name, obj_] of Object.entries(obj.properties ?? {})) {
                const schema_ = Schema.fromSchema(obj_);
                if (required.has(name)) {
                    schema_.required = true;
                }
                schema.properties[name] = schema_;
            }
            if (obj.additionalProperties) {
                if (typeof obj.additionalProperties === "boolean") {
                    schema.additional = new Schema();
                } else {
                    schema.additional = Schema.fromSchema(obj.additionalProperties);
                }
            }
        }
        return schema;
    }

    static fromParam(obj: ParameterObject | ReferenceObject): Schema {
        if (isReferenceObject(obj)) {
            return Schema.fromRef(obj);
        }
        if (obj.schema) {
            const schema = Schema.fromSchema(obj.schema);
            if (obj.required) {
                schema.required = true;
            }
            if (obj.description) {
                schema.description = obj.description;
            }
            return schema;
        }
        const schema = new Schema(obj.type);
        schema.description = obj.description ?? "";
        if (obj.required) {
            schema.required = true;
        }
        if (schema.type === "array") {
            schema.items = Schema.fromSchema(obj.items ?? {});
        }
        return schema;
    }

    static fromRes(obj: ResponseObject | ReferenceObject): Schema {
        if (isReferenceObject(obj)) {
            return Schema.fromRef(obj);
        }
        let schema = new Schema();
        if (obj.schema) {
            schema = Schema.fromSchema(obj.schema);
        }
        if (obj.description) {
            schema.description = obj.description;
        }
        return schema;
    }

}