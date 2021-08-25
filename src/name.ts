
import ts from "typescript";
import { Schema } from "./schema";

export interface OperationName {
  snake: string;  // used for method names
  pascal: string; // used for type names
}

export function inferOperationName(method: string, path: string): OperationName {
  if (path.endsWith(".json")) {
      path = path.slice(0, -5);
  }
  const path_segments = path.split("/").filter(segment => {
    return segment != "" && !segment.includes("{");
  });
  const parts = [method.toLowerCase(), ...path_segments];
  return {
    snake: parts.join("_"),
    pascal: parts.map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(''),
  };
}

export function toRequestSchema(name: OperationName): Schema {
  const request = new Schema("void");
  request.merge(new Schema(`${name.pascal}Query`));
  request.merge(new Schema(`${name.pascal}Path`));
  const body = new Schema(`${name.pascal}Body`);
  body.required = true;
  request.setProperty("body", body);
  return request;
}