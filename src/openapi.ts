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

export type DeprecatableObject = OpenAPIV3.SchemaObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ParameterObject;

export function isDeprecatedObject(obj: DeprecatableObject): boolean {
  if (typeof obj.deprecated === 'boolean') {
    return obj.deprecated;
  }
  if ('x-deprecated' in obj && typeof obj['x-deprecated'] === 'boolean') {
    return obj['x-deprecated'];
  }
  return false;
}

