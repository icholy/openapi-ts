
const fs = require("fs");
const path = require("path");
const chai = require("chai");
const { load, transform, analyse, Schema, Printer } = require("../lib");

chai.use(require("chai-diff"));
const expect = chai.expect;

async function runTransformTest(spec) {
  const dir = path.join(__dirname, "specs", spec);
  const doc = await load(path.join(dir, "input.json"));
  const details = analyse(doc);
  const code = transform(details);
  if (process.env.UPDATE_SPEC_OUTPUT) {
    await fs.promises.writeFile(path.join(dir, "output.ts"), code);
    return;
  }
  const expected = await fs.promises.readFile(path.join(dir, "output.ts"), "utf-8");
  expect(code).not.differentFrom(expected, { relaxedSpace: true });
}

describe("e2e", () => {
  it("should transform an empty spec", () => runTransformTest("empty"));
  it("should transform primitive parameters", () => runTransformTest("primitives"));
  it("should transform additionalProperties", () => runTransformTest("additional"));
  it("should transform the body parameters", () => runTransformTest("body"));
  it("should transform allof", () => runTransformTest("allof"));
  it("should transform shared parameters", () => runTransformTest("shared"));
  it("should transform components", () => runTransformTest("components"));
  it("should transform regression tests", () => runTransformTest("regression"));
  it("should transform requestBodies", () => runTransformTest("requestBodies"));
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
  it("should print enum union", () => {
    const s = new Schema("string", { enum: ["a", "b"] });
    const print = new Printer();
    print.type(s);
    const code = print.code();
    expect(code).not.differentFrom(`"a" | "b"`);
  });
  it("should print a numeric enum", () => {
    const s = new Schema("number", { enum: [1.123, 2] });
    const print = new Printer({ enum: true });
    print.schema(s, "A");
    const code = print.code();
    expect(code).not.differentFrom(`enum A {
      X1_123 = 1.123,
      X2 = 2
    }`, { relaxedSpace: true });
  });
  it("should print a string enum", () => {
    const s = new Schema("string", { enum: ["promo", "delivery-destintation"] });
    const print = new Printer({ enum: true });
    print.schema(s, "A");
    const code = print.code();
    expect(code).not.differentFrom(`enum A {
      PROMO = "promo",
      DELIVERY_DESTINTATION = "delivery-destintation"
    }`, { relaxedSpace: true });
  });
  it("should print a union if the enum contains a boolean", () => {
    const s = new Schema("boolean", { enum: [true, false] });
    const print = new Printer();
    print.schema(s, "A");
    const code = print.code();
    expect(code).not.differentFrom(`export type A = true | false;`, { relaxedSpace: true });
  });
});
