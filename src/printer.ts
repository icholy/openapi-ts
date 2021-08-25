
import ts from "typescript";
import { Schema } from "./schema";
import prettier from "prettier";

/**
 * A helper for printing typescript ASTs.
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

    constructor() {}
    
    /**
     * Write an AST node.
     */
    node(node: ts.Node): void {
        const code = this.printer.printNode(ts.EmitHint.Unspecified, node, this.output);
        this.emitted.push(prettier.format(code, { parser: "babel", printWidth: 100 }));
    }

    /**
     * Write a single line comment.
     */
    comment(comment: string): void {
        this.emitted.push(`// ${comment}`);
    }

    /**
     * Write a schema.
     */
    schema(schema: Schema, name: string): void {
        const node = schema.toTypeDeclaration(name);
        this.node(node);
    }

    /**
     * Get the printed code. 
     */
    code(): string {
        return this.emitted.join("\n");
    }
}