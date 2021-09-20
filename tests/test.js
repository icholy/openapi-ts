
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

describe("e2e", async () => {
  it("should transform an empty spec", async () => await runTransformTest("empty"));
  it("should transform primitive parameters", async () => await runTransformTest("primitives"));
  it("should transform additionalProperties", async () => await runTransformTest("additional"));
  it("should transform the body parameters", async () => await runTransformTest("body"));
  it("should transform allof", async () => await runTransformTest("allof"));
  it("should transform shared parameters", async () => await runTransformTest("shared"));
  it("should transform definitions", async () => await runTransformTest("definition"));
});

describe("Printer", async () => {
  it("should not emit empty type literal if there's a heritage", async () => {
    const schema = new Schema("object");
    schema.merge(new Schema("A"));
    schema.merge(new Schema("B"));
    const print = new Printer();
    print.type(schema);
    const code = print.code();
    expect(code).not.differentFrom(`A & B`, { relaxedSpace: true });
  });
  it("should not emit duplicate when merging same ref", async () => {
    const schema = new Schema("object");
    schema.merge(new Schema("A"));
    schema.merge(new Schema("A"));
    const print = new Printer();
    print.type(schema);
    const code = print.code();
    expect(code).not.differentFrom(`A`, { relaxedSpace: true });
  });
});
