# openapi-ts

> Library for generating TypeScript interfaces from OpenAPI v2 definitions.

## CLI:

The package comes with a cli tool with a basic transformer implementation.

```
$ openapi-ts ./swagger.json
```

## Basic Usage:

``` ts
import { load, analyse, transform } from "@icholy/openapi-ts";

function main() {
  const doc = await load("swagger.json");
  const details = analyse(doc);
  console.log(transform(details));
}
```

## Custom Transform

``` ts
import {
  load,
  analyse,
  Schema,
  Printer,
  DocumentDetails
} from "@icholy/openapi-ts";

function main() {
  const doc = await load("swagger.json");
  const details = analyse(doc);
  console.log(transform(details));
}

function transform(doc: DocumentDetails): string {
  const print = new Printer();
  
  // output definitions
  for (const [name, schema] of Object.entries(doc.definitions)) {
    print.schema(schema, name);
  }

  // output body types with random names
  for (const op of doc.operations) {
    // usually the name is inferred from the op's method/path
    print.schema(op.params.body, "InterfaceNameHere");
  }
  
  // output a custom type
  const schema = new Schema("object");
  schema.setProperty("a", new Schema("string", { required: true }));
  schema.setProperty("b", new Schema("SomeOtherType"));
  print.schema(schema, "MyType");

  // output types for each route
  return print.code();
}
```
