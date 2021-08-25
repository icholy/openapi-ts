
import ts from "typescript";
import {
    isReferenceObject,
    ReferenceObject,
    SchemaObject,
    ParameterObject,
    ResponseObject,
} from "./openapi";

/**
 * The intermediate representation of a type.
 */
export class Schema {

    // decription is used for comments on properties.
    description = "";

    // required controls the output of the ? modifier.
    required = false;

    // if the type name isn't one of the well known types, it's a reference type.
    type: string;

    // array element type.
    items?: Schema;

    // object properties.
    properties: Record<string, Schema> = {};

    // allow additional properties on the object with the specified type.
    additional?: Schema;

    // the generated type will extend these type names.
    heritage: string[] = [];

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

    /**
     * Returns true if this is a reference type.
     */
    isRef() {
        switch (this.type) {
            case "string":
            case "number":
            case "boolean":
            case "array":
            case "object":
            case "void":
                return false;
            default:
                return true;
        }
    }

    /**
     * Returns true if this is a void type.
     */
    isVoid(): boolean {
        return this.type === "void";
    }

    /**
     * Copy all properties from the provided schema into our own properties.
     * If schema is a reference type, add it to the heritage so that the generated
     * type inherits from it.
     */
    merge(schema: Schema): void {
        if (this.type === "void") {
            this.type = "object";
        }
        if (schema.isRef()) {
            this.heritage.push(schema.type);
        } else {
            for (const [name, schema_] of Object.entries(schema.properties)) {
                this.setProperty(name, schema_);
            }
        }
    }

    /**
     * Add a property with the specified name and type.
     * If our type is void, it will automatically be converted to an object.
     * If our type is neither void or object, this method will throw an error.
     */
    setProperty(name: string, schema: Schema): void {
        if (this.type === "void") {
            this.type = "object";
        }
        if (this.type !== "object") {
            throw new Error(`cannot set property ${name} on ${this.type}`);
        }
        this.properties[name] = schema;
    }

    /**
     * Add a described by the provided param.
     * This is a helper which delegates to setProperty.
     */
    setParameter(param: ParameterObject): void {
        if (!param.name) {
            throw new Error('parameter must have name');
        }
        this.setProperty(param.name, Schema.fromParam(param));
    }

    /**
     * Create a schema from an openapi v2 reference object.
     */
    static fromRef(ref: ReferenceObject): Schema {
        const parts = ref.$ref.split("/");
        return new Schema(parts[parts.length - 1])
    }

    /**
     * Create a schema from an openapi v2 schema object.
     */
    static fromSchema(obj: SchemaObject | ReferenceObject): Schema {
        if (isReferenceObject(obj)) {
            return Schema.fromRef(obj);
        }
        if (obj.allOf) {
            const union = new Schema();
            for (const obj_ of obj.allOf) {
                const schema_ = Schema.fromSchema(obj_);
                union.merge(schema_);
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

    /**
     * Create a schema from an openapi v2 parameter object.
     */
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

    /**
     * Create a schema from a response object.
     */
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