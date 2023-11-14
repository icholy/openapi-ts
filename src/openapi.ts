import { OpenAPIV3 as openapi3 } from 'openapi-types'

export interface OpenAPI3 {
  openapi: string;
  paths?: Record<string, PathItemObject>;
  definitions?: Record<string, SchemaObject>;
  parameters?: ParameterObject[];
  components?: ComponentsObject;
}

export type Parameter = openapi3.ReferenceObject | ParameterObject;

export interface ComponentsObject {
  schemas?: openapi3.ComponentsObject['schemas'],
  requestBodies?: Record<string, RequestBody>;
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
  requestBody?: RequestBody;
  responses?: Record<string, ResponseObject>; // required
  deprecated?: boolean;
}

export type MediaTypeObject = openapi3.MediaTypeObject;

export interface ParameterObject {
  name?: string; // required
  in?: "query" | "header" | "path";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: ReferenceObject | SchemaObject;
  type?: "string" | "number" | "integer" | "boolean" | "array" | "file";
  items?: openapi3.ReferenceObject | SchemaObject;
  enum?: string[]; // ignored
}

export type ReferenceObject = openapi3.ReferenceObject;

export function isReferenceObject(obj: any): obj is ReferenceObject {
  return obj.hasOwnProperty("$ref") && typeof obj.$ref === "string";
}

export interface ResponseObject {
  description?: string;
  content?: Record<string, MediaTypeObject>;
}

export type RequestBody = openapi3.RequestBodyObject;

export type SchemaObject = openapi3.SchemaObject;

export function isArraySchemaObject(schema: SchemaObject): schema is openapi3.ArraySchemaObject {
  return schema.type === 'array';
}

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

export function isMethod(method: string): method is Method {
  return methods.has(method);
}

