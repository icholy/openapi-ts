
import {
    isReferenceObject,
    ReferenceObject,
    SchemaObject,
    ParameterObject,
    ResponseObject,
    MediaTypeObject,
    RequestBody,
    OpenAPI3,
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
    heritage?: string[];
    index?: string[];
    deprecated?: boolean;
}

/**
 * The intermediate representation of a type.
 */
export class Schema {

    // decription is used for comments on properties.
    description = "";

    // required controls the output of the ? modifier.
    required = false;

    // indicates if the schema is deprecated
    deprecated = false;

    // if the type name isn't one of the well known types, it's a reference type.
    type: string;

    // indexed access types.
    index: string[] = [];

    // array element type.
    items?: Schema;

    // enum values
    enum?: any[] = [];

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
            case "file":
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
            case "empty":
                return false;
            default:
                return true;
        }
    }

    /**
     * Returns true if this is an empty type.
     */
    isEmpty(): boolean {
        return this.type === "empty";
    }

    /**
     * Returns true if any of the properties are required.
     */
    hasRequired(): boolean {
        for (const schema of Object.values(this.properties)) {
            if (schema.required) {
                return true;
            }
        }
        return false;
    }

    /**
     * Copy all properties from the provided schema into our own properties.
     * If schema is a reference type, add it to the heritage so that the generated
     * type inherits from it.
     */
    merge(schema: Schema): void {
        if (this.type === "empty") {
            this.type = "object";
        }
        if (schema.isRef()) {
            if (!this.heritage.includes(schema.type)) {
                this.heritage.push(schema.type);
            }
        } else {
            if (schema.type !== "object") {
                // TODO: convert this into a union
                if (schema.type === this.type) {
                    return;
                }
                throw new Error(`cannot merge ${schema.type} into ${this.type}`);
            }
            for (const [name, schema_] of Object.entries(schema.properties)) {
                const existing = this.properties[name];
                if (existing) {
                    existing.merge(schema_);
                } else {
                    this.setProperty(name, schema_);
                }
            }
        }
    }

    /**
     * Add a property with the specified name and type.
     * If our type is empty, it will automatically be converted to an object.
     * If our type is neither empty or object, this method will throw an error.
     */
    setProperty(name: string, schema: Schema): void {
        if (this.type === "empty") {
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
    lookup(path: string): Schema {
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
                        // TODO: use the analysed definitions to figure this out.
                        return new Schema();
                    }
                    if (schema.type !== "array") {
                        throw new Error(`cannot get array item type from: ${schema.type}`);
                    }
                    schema = schema.items ?? new Schema();
                    break;
                case "":
                    break;
                default:
                    throw new Error(`invalid $ref: ${path}`);
            }
            parts.shift();
        }
        return schema;
    }

    /**
     * Create a schema from an openapi v2 reference object.
     */
    static fromRef(ref: ReferenceObject): Schema {
        const prefix = "#/components/schemas";
        if (!ref.$ref.startsWith(prefix)) {
            throw new Error(`invalid ref: ${ref.$ref}`);
        }
        const [name, ...parts] = ref.$ref.slice(prefix.length + 1).split("/");
        const path = parts.join("/");
        return new Schema(name).lookup(path);
    }

    /**
     * Return the referenced value from the doc.
     */
    static resolveRef(doc: OpenAPI3, ref: ReferenceObject): any {
        if (!ref.$ref.startsWith('#/')) {
            throw new Error(`External references are no supported: ${ref.$ref}`);
        }
        let target: any = doc;
        for (const elem of ref.$ref.slice(2).split("/")) {
            target = target?.[elem]
        }
        if (target === undefined) {
            throw new Error(`Failed to resolve reference: ${ref.$ref}`);
        }
        if (isReferenceObject(target)) {
            return this.resolveRef(doc, target);
        }
        return target;
    }

    /**
     * Create a schema from an openapi v3 request body.
     */
    static fromRequestBody(obj: RequestBody | ReferenceObject, doc: OpenAPI3): Schema {
        if (isReferenceObject(obj)) {
            obj = this.resolveRef(doc, obj) as RequestBody;
        }
        const schema = this.fromContent(obj?.content);
        if (obj?.description) {
            schema.description = obj.description;
        }
        return schema;
    }

    /**
     * Create a schema from an openapi v3 schema object.
     */
    static fromSchema(obj: SchemaObject | ReferenceObject): Schema {
        if (isReferenceObject(obj)) {
            return this.fromRef(obj);
        }
        if (obj.allOf) {
            const union = new Schema();
            for (const obj_ of obj.allOf) {
                const schema_ = this.fromSchema(obj_);
                union.merge(schema_);
            }
            union.deprecated = !!obj.deprecated;
            return union;
        }
        const schema = new Schema(obj.type);
        schema.description = obj.description ?? "";
        if (schema.type === "array") {
            schema.items = this.fromSchema(obj.items ?? {});
        }
        if (obj.enum) {
            for (const v of obj.enum) {
                switch (schema.type) {
                    case "string":
                    case "number":
                        if (typeof v !== schema.type) {
                            throw new Error(`cannot use ${typeof v} in ${schema.type} enum`);
                        }
                        break;
                    default:
                        throw new Error(`invalid enum type: ${schema.type}`);
                }
            }
            schema.enum = obj.enum;
        }
        if (schema.type === "object") {
            const required = new Set(obj.required ?? []);
            for (const [name, obj_] of Object.entries(obj.properties ?? {})) {
                const schema_ = this.fromSchema(obj_);
                if (required.has(name)) {
                    schema_.required = true;
                }
                schema.properties[name] = schema_;
            }
            if (obj.additionalProperties) {
                if (typeof obj.additionalProperties === "boolean") {
                    schema.additional = new Schema();
                } else {
                    schema.additional = this.fromSchema(obj.additionalProperties);
                }
            }
        }
        schema.deprecated = !!obj.deprecated;
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
            const schema = this.fromSchema(obj.schema);
            if (obj.required) {
                schema.required = true;
            }
            if (obj.description) {
                schema.description = obj.description;
            }
            schema.deprecated = !!obj.deprecated;
            return schema;
        }
        const schema = new Schema(obj.type);
        schema.description = obj.description ?? "";
        if (obj.required) {
            schema.required = true;
        }
        if (schema.type === "array") {
            schema.items = this.fromSchema(obj.items ?? {});
        }
        schema.deprecated = !!obj.deprecated;
        return schema;
    }

    /**
     * Create a schema from a response object.
     */
    static fromRes(obj: ResponseObject): Schema {
        const schema = this.fromContent(obj.content);
        if (obj.description) {
            schema.description = obj.description;
        }
        return schema;
    }

    static fromContent(obj?: Record<string, MediaTypeObject>): Schema {
        const media = obj?.["application/json"];
        if (!media?.schema) {
            return new Schema("empty");
        }
        return this.fromSchema(media.schema);
    }

}