
import ts from "typescript";

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

export function toRequestInterface(name: OperationName): ts.InterfaceDeclaration {
    return ts.factory.createInterfaceDeclaration(
        [], // decorators
        [
            ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
        ], // modifiers
        ts.factory.createIdentifier(`${name.pascal}Request`),
        [], // type parameters
        [
            ts.factory.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [
                    ts.factory.createExpressionWithTypeArguments(
                        ts.factory.createIdentifier(`${name.pascal}Query`),
                        undefined
                    ),
                    ts.factory.createExpressionWithTypeArguments(
                        ts.factory.createIdentifier(`${name.pascal}Path`),
                        undefined
                    ),
                ],
            )
        ],
        [
            ts.factory.createPropertySignature(
                undefined,
                ts.factory.createIdentifier("body"),
                undefined,
                ts.factory.createTypeReferenceNode(`${name.pascal}Body`),
            ),
        ],
    )
}