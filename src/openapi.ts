import { OpenAPIV3 } from 'openapi-types'

export function isReferenceObject(obj: any): obj is OpenAPIV3.ReferenceObject {
  return obj.hasOwnProperty("$ref") && typeof obj.$ref === "string";
}

export function isArraySchemaObject(schema: OpenAPIV3.SchemaObject): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === 'array';
}

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

export function isMethod(method: string): method is Method {
  return methods.has(method);
}

