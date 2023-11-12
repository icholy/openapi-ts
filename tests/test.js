
const fs = require("fs");
const path = require("path");
const chai = require("chai");
const { load, transform, analyse, Schema, Printer } = require("../lib");

chai.use(require("chai-diff"));
const expect = chai.expect;

async function runTransformTest(spec) {
  const dir = path.join(__dirname, "specs", spec);
  let doc = await load(path.join(dir, "input.json"));

  // convert to v3
  if ('swagger' in doc) {
    const { convert } = require("api-spec-converter");
    const converted = await convert({
      from: 'swagger_2',
      to: 'openapi_3',
      source: doc
    });
    doc = converted.spec;
  }

  // console.log(JSON.stringify(doc, null, 2));

  const details = analyse(doc);
  const code = transform(details);
  if (process.env.UPDATE_SPEC_OUTPUT) {
    await fs.promises.writeFile(path.join(dir, "output.ts"), code);
    return;
  }
  const expected = await fs.promises.readFile(path.join(dir, "output.ts"), "utf-8");
  expect(code).not.differentFrom(expected, { relaxedSpace: true });
}

describe.only("e2e", () => {
  it.skip("should transform an empty spec", () => runTransformTest("empty"));
  it("should transform primitive parameters", () => runTransformTest("primitives"));
  it.skip("should transform additionalProperties", () => runTransformTest("additional"));
  it.skip("should transform the body parameters", () => runTransformTest("body"));
  it.skip("should transform allof", () => runTransformTest("allof"));
  it.skip("should transform shared parameters", () => runTransformTest("shared"));
  it.skip("should transform definitions", () => runTransformTest("definition"));
  it.skip("should transform regression tests", () => runTransformTest("regression"));
});

describe("Printer", () => {
  it("should not emit empty type literal if there's a heritage", () => {
    const schema = new Schema("object");
    schema.merge(new Schema("A"));
    schema.merge(new Schema("B"));
    const print = new Printer();
    print.type(schema);
    const code = print.code();
    expect(code).not.differentFrom(`A & B`, { relaxedSpace: true });
  });
  it("should not emit duplicate when merging same ref", () => {
    const schema = new Schema("object");
    schema.merge(new Schema("A"));
    schema.merge(new Schema("A"));
    const print = new Printer();
    print.type(schema);
    const code = print.code();
    expect(code).not.differentFrom(`A`, { relaxedSpace: true });
  });
  it("should merge object properties", () => {
    const a = new Schema("object", {
      properties: {
        a: new Schema("string"),
      },
    });
    const b = new Schema("object", {
      properties: {
        b: new Schema("boolean"),
      },
    });
    a.merge(b);
    const print = new Printer();
    print.type(a);
    const code = print.code();
    expect(code).not.differentFrom(`{
      a?: string;
      b?: boolean;
    }`, { relaxedSpace: true });
  });
  it("should merge nested object properties", () => {
    const a = new Schema("object", {
      properties: {
        x: new Schema("object", {
          properties: {
            y: new Schema("string"),
          },
        }),
      },
    });
    const b = new Schema("object", {
      properties: {
        x: new Schema("object", {
          properties: {
            z: new Schema("number"),
          },
        }),
      },
    });
    a.merge(b);
    const print = new Printer();
    print.type(a);
    const code = print.code();
    expect(code).not.differentFrom(`{
      x?: {
        y?: string;
        z?: number;
      };
    }`, { relaxedSpace: true });
  });
});
