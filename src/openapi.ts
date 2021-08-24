export interface OpenAPI2 {
  swagger: string; // required
  paths?: Record<string, PathItemObject>;
  definitions?: Record<string, SchemaObject>;
  parameters?: ParameterObject[];
  responses?: Record<string, ResponseObject>; // required
}

export interface HeaderObject extends Omit<ParameterObject, "name" | "in"> {}

export type Parameter = ReferenceObject | ParameterObject;

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

const MethodSet = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

export function isMethod(method: string): method is Method {
  return MethodSet.has(method);
}

export interface PathItemObject {
  $ref?: string; // ignored
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  parameters?: Parameter[];
}

export interface OperationObject {
  description?: string;
  tags?: string[]; // unused
  summary?: string; // unused
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: ReferenceObject | RequestBody; // ignored
  responses?: Record<string, ReferenceObject | ResponseObject>; // required
  deprecated?: boolean;
}

export interface ParameterObject {
  name?: string; // required
  in?: "query" | "header" | "path" | "formData" | "body"; // required
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: ReferenceObject | SchemaObject; // required
  type?: "string" | "number" | "integer" | "boolean" | "array" | "file";
  items?: ReferenceObject | SchemaObject;
  enum?: string[]; // ignored
}

export type ReferenceObject = { $ref: string };

export function isReferenceObject(obj: any): obj is ReferenceObject {
  return obj.hasOwnProperty("$ref") && typeof obj.$ref === "string";
}

export interface ResponseObject {
  description?: string;
  headers?: Record<string, ReferenceObject | HeaderObject>;
  schema?: ReferenceObject | SchemaObject;
}

export interface RequestBody {
  description?: string;
  content?: {
    [contentType: string]: { schema: ReferenceObject | SchemaObject };
  };
}

export interface SchemaObject {
  title?: string; // ignored
  description?: string;
  required?: string[];
  enum?: string[]; // ignored
  type?: string; // assumed "object" if missing
  items?: ReferenceObject | SchemaObject;
  allOf?: SchemaObject[]; // ignored
  properties?: Record<string, ReferenceObject | SchemaObject>;
  default?: any; // ignored
  additionalProperties?: boolean | ReferenceObject | SchemaObject;
}
