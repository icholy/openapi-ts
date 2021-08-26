
import ts from "typescript";
import {
    isReferenceObject,
    ReferenceObject,
    SchemaObject,
    ParameterObject,
    ResponseObject,
} from "./openapi";

/**
 * Options for configuring a schema.
 */
export interface SchemaOptions {
    description?: string;
    required?: boolean;
    items?: Schema;
    properties?: Record<string, Schema>;
    additional?: boolean;
    heritage?: boolean;
    index?: string[];
}

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

    // indexed access types.
    index: string[] = [];

    // array element type.
    items?: Schema;

    // object properties.
    properties: Record<string, Schema> = {};

    // allow additional properties on the object with the specified type.
    additional?: Schema;

    // the generated type will extend these type names.
    heritage: string[] = [];

    constructor(type: string = "object", options?: SchemaOptions) {
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
        Object.assign(this, options);
    }

    /**
     * Returns a shalow clone of the schema.
     */
    clone(): Schema {
        const schema = Object.create(Schema.prototype);
        Object.assign(schema, this);
        schema.index = this.index.slice();
        schema.heritage = this.heritage.slice();
        schema.properties = Object.assign({}, this.properties);
        return schema;
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
     * Lookup a subschema using a path.
     */
    lookup(path: string): Schema | null {
        let schema: Schema = this;
        const parts = path.split("/");
        while (parts.length > 0) {
            switch (parts[0]) {
                case "properties":
                    if (parts.length < 2) {
                        throw new Error(`$ref missing property name: ${path}`);
                    }
                    parts.shift();
                    const name = parts[0];
                    if (schema.isRef()) {
                        schema = schema.clone();
                        schema.index.push(name);
                        break;
                    }
                    if (schema.type == "object") {
                        if (!this.properties[name]) {
                            throw new Error(`cannot find property: ${name}`);
                        }
                        schema = this.properties[name];
                        break;
                    }
                    break;
                case "items":
                    if (schema.isRef()) {
                        // index access types don't support arrays.
                        return null;
                    }
                    if (schema.type !== "array") {
                        throw new Error(`cannot get array item type from: ${schema.type}`);
                    }
                    schema = schema.items ?? new Schema();
                    break;
                case "":
                    break;
                default:
                    throw new Error(`unsuported $ref: ${path}`);
            }
            parts.shift();
        }
        return schema;
    }

    /**
     * Create a schema from an openapi v2 reference object.
     */
    static fromRef(ref: ReferenceObject): Schema {
        if (!ref.$ref.startsWith("#/definitions/")) {
            throw new Error(`unsuported ref 1: ${ref.$ref}`);
        }
        const [name, ...parts] = ref.$ref.slice(14).split("/");
        const path = parts.join("/");
        const schema = new Schema(name).lookup(path);
        if (!schema) {
            throw new Error(`unsuported ref: ${ref.$ref}`);
        }
        return schema;
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