
import ts from "typescript";
import { Schema } from "./schema";

/**
 * This class converts schemas to typescript.
 */
export class TypeScriptPrinter {

    private emitted: string[] = [];

    private printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
        noEmitHelpers: true,
    });

    private output = ts.createSourceFile(
        "placeholder.ts",
        "",
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS,
    );

    constructor() { }

    /**
     * Write an AST node.
     */
    node(node: ts.Node): void {
        const code = this.printer.printNode(ts.EmitHint.Unspecified, node, this.output);
        this.raw(code);
    }

    /**
     * Write a raw string.
     */
    raw(line: string): void {
        this.emitted.push(line);
    }

    /**
     * Write blank line.
     */
    blank(): void {
        this.raw("");
    }

    /**
     * Write a single line comment.
     */
    comment(comment: string): void {
        this.raw(`// ${comment}`);
    }

    /**
     * Write a schema.
     */
    schema(schema: Schema, name: string): void {
        const node = this.toTypeDeclaration(schema, name);
        this.node(node);
    }

    /**
     * Get the printed code. 
     */
    code(): string {
        return this.emitted.join("\n");
    }

    /**
    * Create the set of type signatures for the properties and an
    * index signature of additional is set.
    */
    private toSignatures(schema: Schema): ts.TypeElement[] {
        const sigs: ts.TypeElement[] = Object.entries(schema.properties).map(([name, schema_]) => {
            const sig = ts.factory.createPropertySignature(
                undefined,
                ts.factory.createIdentifier(name),
                schema_.required ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                this.toTypeNode(schema_),
            );
            if (schema_.description) {
                return ts.addSyntheticLeadingComment(
                    sig,
                    ts.SyntaxKind.SingleLineCommentTrivia,
                    " " + schema_.description,
                    false,
                )
            }
            return sig;
        });
        if (schema.additional) {
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
                    this.toTypeNode(schema.additional),
                )
            );
        }
        return sigs;
    }

    /**
     * Create a type from the schema.
     * Note: an object with no properties outputs as 'any'.
     */
    private toTypeNode(schema: Schema): ts.TypeNode {
        switch (schema.type) {
            case "string":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case "number":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case "boolean":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case "void":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
            case "array":
                let items: ts.TypeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                if (schema.items) {
                    items = this.toTypeNode(schema.items);
                }
                return ts.factory.createArrayTypeNode(items);
            case "object":
                const sigs = this.toSignatures(schema);
                if (sigs.length === 0 && schema.heritage.length === 0) {
                    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                }
                const lit = ts.factory.createTypeLiteralNode(sigs);
                if (schema.heritage.length > 0) {
                    const refs = schema.heritage.map(name => ts.factory.createTypeReferenceNode(name));
                    return ts.factory.createIntersectionTypeNode([lit, ...refs]);
                }
                return lit;
            default:
                return ts.factory.createTypeReferenceNode(schema.type);
        }
    }

    /**
     * Create a type alias declaration.
     */
    private toTypeAliasDeclaration(schema: Schema, name: string): ts.TypeAliasDeclaration {
        return ts.factory.createTypeAliasDeclaration(
            [], // decorators,
            [
                ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
            ], // modifiers
            ts.factory.createIdentifier(name),
            [], // type parameters
            this.toTypeNode(schema),
        );
    }

    /**
     * Create either an interface or type alias declaration.
     * Note: reference types with no heritage result in type aliases.
     */
    private toTypeDeclaration(schema: Schema, name: string): ts.Declaration {
        if (schema.type === "object") {
            const sigs = this.toSignatures(schema);
            const heritage = [];
            if (schema.heritage.length > 0) {
                heritage.push(
                    ts.factory.createHeritageClause(
                        ts.SyntaxKind.ExtendsKeyword,
                        schema.heritage.map((name) => {
                            return ts.factory.createExpressionWithTypeArguments(
                                ts.factory.createIdentifier(name),
                                undefined
                            );
                        })
                    )
                )
            }
            if (sigs.length === 0 && heritage.length === 0) {
                return this.toTypeAliasDeclaration(schema, name);
            }
            return ts.factory.createInterfaceDeclaration(
                [], // decorators
                [
                    ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
                ], // modifiers
                ts.factory.createIdentifier(name),
                [], // type parameters
                heritage, // heritage clause
                this.toSignatures(schema),
            );
        }
        return this.toTypeAliasDeclaration(schema, name);
    }
}