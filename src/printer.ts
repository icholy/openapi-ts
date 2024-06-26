
import ts from "typescript";
import { Schema } from "./schema";

/**
 * Configuration options for printer output.
 */
export interface PrinterOptions {
    // emit enum types
    enum?: boolean;
}

/**
 * This class converts schemas to typescript.
 */
export class Printer {

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

    constructor(private options: PrinterOptions = {}) {}

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
        for (const line of comment.split("\n")) {
            this.raw(`// ${line}`);
        }
    }

    /**
     * Write a schema.
     */
    schema(schema: Schema, name: string): void {
        const node = this.toTypeDeclaration(schema, name);
        this.node(node);
    }

    /**
     * Write an import
     */
    import(path: string, names: string[]): void {
        const node = this.toImportDeclaration(path, names);
        this.node(node);
    }

    /**
     * Write a type literal without any declaration.
     */
    type(schema: Schema): void {
        const node = this.toTypeNode(schema);
        this.node(node);
    }

    /**
     * Convert an AST node to a string.
     */
    static node(node: ts.Node): string {
        const print = new Printer();
        print.node(node);
        return print.code();
    }

    /**
     * Convert a schema to declaration string.
     */
    static schema(schema: Schema, name: string): string {
        const print = new Printer();
        print.schema(schema, name);
        return print.code();
    }

    /**
     * Convert an import to a string. 
     */
    static import(path: string, names: string[]): string {
        const print = new Printer();
        print.import(path, names);
        return print.code();
    }

    /**
     * Convert schema to type string.
     */
    static type(schema: Schema): string {
        const print = new Printer();
        print.type(schema);
        return print.code();
    }

    /**
     * Get the printed code. 
     */
    code(): string {
        return this.emitted.join("\n");
    }

    /**
     * Returns true if c is a character in the alphabet.
     */
    private isAlpha(c: string): boolean {
        return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
    }

    /**
     * Returns true if c is a digit.
     */
    private isDigit(c: string): boolean {
        return "0" <= c && c <= "9";
    }

    /**
     * Returns true if s can be used as an identifier.
     */
    private isValidIdent(s: string): boolean {
        const first = s.charAt(0);
        if (!this.isAlpha(first) && first !== "_" && first !== "$") {
            return false;
        }
        for (let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            if (!this.isAlpha(c) && !this.isDigit(c) && c != "$" && c != "_") {
                return false;
            }
        }
        return true;
    }

    /**
    * Create the set of type signatures for the properties and an
    * index signature of additional is set.
    */
    private toSignatures(schema: Schema): ts.TypeElement[] {
        const sigs: ts.TypeElement[] = Object.entries(schema.properties).map(([name, schema_]) => {
            const sig = ts.factory.createPropertySignature(
                undefined,
                this.isValidIdent(name) ? ts.factory.createIdentifier(name) : ts.factory.createStringLiteral(name),
                schema_.required ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                this.toTypeNode(schema_),
            );
            if (schema_.description || schema_.deprecated) {
                return ts.addSyntheticLeadingComment(
                    sig,
                    ts.SyntaxKind.SingleLineCommentTrivia,
                    schema_.deprecated ? "@deprecated" : ` ${schema_.description}`,
                    false,
                )
            }
            return sig;
        });
        if (schema.additional) {
            sigs.push(
                ts.factory.createIndexSignature(
                    undefined,
                    [ts.factory.createParameterDeclaration(
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
     * Create a literal type for the provided value.
     */
    private toLiteral(value: any): ts.LiteralTypeNode["literal"] {
        switch (typeof value) {
            case "number":
                return ts.factory.createNumericLiteral(value);
            case "string":
                return ts.factory.createStringLiteral(value);
            case "boolean":
                return value ? ts.factory.createTrue() : ts.factory.createFalse();
            default:
                throw new Error(`unsuported literal type: ${typeof value}`);
        }
    }

    /**
     * Create a type from the schema.
     * Note: an object with no properties outputs as 'Record<string|number, any>'.
     */
    private toTypeNode(schema: Schema): ts.TypeNode {
        const node = this.toNonNullTypeNode(schema);
        if (schema.nullable) {
            return ts.factory.createUnionTypeNode([
                node,
                ts.factory.createLiteralTypeNode(ts.factory.createNull()),
            ])
        }
        return node;
    }

    /**
     * Create a type from the schema without the nullable attribute being applied.
     */
    private toNonNullTypeNode(schema: Schema): ts.TypeNode {
        if (schema.enum.length > 0) {
            return ts.factory.createUnionTypeNode(
                schema.enum.map(value => {
                    const lit = this.toLiteral(value);
                    return ts.factory.createLiteralTypeNode(lit);
                }),
            );
        }
        switch (schema.type) {
            case "string":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case "number":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case "boolean":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case "empty":
                return ts.factory.createTypeLiteralNode([]);
            case "array":
                let items: ts.TypeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                if (schema.items) {
                    items = this.toTypeNode(schema.items);
                }
                return ts.factory.createArrayTypeNode(items);
            case "object":
                const sigs = this.toSignatures(schema);
                if (sigs.length === 0 && schema.heritage.length === 0) {
                    return ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("Record"),
                        [
                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                        ]
                    );
                }
                const lit = ts.factory.createTypeLiteralNode(sigs);
                if (schema.heritage.length > 0) {
                    const refs = schema.heritage.map(name => ts.factory.createTypeReferenceNode(name));
                    if (sigs.length === 0) {
                        return ts.factory.createIntersectionTypeNode(refs);
                    }
                    return ts.factory.createIntersectionTypeNode([lit, ...refs]);
                }
                return lit;
            default:
                let node: ts.TypeNode = ts.factory.createTypeReferenceNode(schema.type);
                for (let index of schema.index) {
                    node = ts.factory.createIndexedAccessTypeNode(node,
                        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(index)));
                }
                return node;
        }
    }

    /**
     * Create a type alias declaration.
     */
    private toTypeAliasDeclaration(schema: Schema, name: string): ts.TypeAliasDeclaration {
        return ts.factory.createTypeAliasDeclaration(
            [
                ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
            ], // modifiers
            ts.factory.createIdentifier(name),
            [], // type parameters
            this.toTypeNode(schema),
        );
    }

    private toEnumMemberName(value: any): string {
        switch (typeof value) {
            case "boolean":
                return value ? "TRUE" : "FALSE";
            case "number":
            case "string":
                break;
            default:
                throw new Error(`cannot create enum member name for: ${value}`);
        }
        let name = value.toString()
        name = name.replace(/[\W]/, '_');
        name = name.toUpperCase();
        if (!name.charAt(0).match(/[a-z]/i)) {
            name = `X${name}`;
        }
        return name;
    }

    private toEnumDeclaration(schema: Schema, name: string): ts.Declaration {
        const valid = schema.enum.every((v) => typeof v === "number" || typeof v === "string");
        if (!valid || !this.options.enum) {
            return this.toTypeAliasDeclaration(schema, name);
        }
        return ts.factory.createEnumDeclaration(
            undefined,
            ts.factory.createIdentifier(name),
            schema.enum.map((value) => {
                const name = this.toEnumMemberName(value);
                return ts.factory.createEnumMember(
                    ts.factory.createIdentifier(name),
                    this.toLiteral(value),
                );
            }),
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
                [
                    ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
                ], // modifiers
                ts.factory.createIdentifier(name),
                [], // type parameters
                heritage, // heritage clause
                this.toSignatures(schema),
            );
        }
        if (schema.enum.length > 0) {
            return this.toEnumDeclaration(schema, name);
        }
        return this.toTypeAliasDeclaration(schema, name);
    }

    /**
     * Create an import declaration for the provided path and names.
     */
    private toImportDeclaration(path: string, names: string[]): ts.ImportDeclaration {
        return ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
                false,
                undefined,
                ts.factory.createNamedImports(
                    names.map((name) => {
                        return ts.factory.createImportSpecifier(
                            false,
                            undefined,
                            ts.factory.createIdentifier(name)
                        )
                    })
                )
            ),
            ts.factory.createStringLiteral(path)
        );
    }
}
