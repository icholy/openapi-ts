
const fs = require("fs");
const path = require("path");
const chai = require("chai");
const { load, transform } = require("../lib");

chai.use(require("chai-diff"));
const expect = chai.expect;

async function runTransformTest(spec) {
  const dir = path.join(__dirname, "specs", spec);
  const expected = await fs.promises.readFile(path.join(dir, "output.ts"), "utf-8");
  const code = await transform(await load(path.join(dir, "input.json")));
  expect(code).not.differentFrom(expected, { relaxedSpace: true });
}

it("should transform an empty spec", async () => await runTransformTest("empty"));
it("should transform primitive parameters", async () => await runTransformTest("primitives"));
it("should transform additionalProperties", async () => await runTransformTest("additional"));
it("should transform the body parameters", async () => await runTransformTest("body"));
it("should transform allof", async () => await runTransformTest("allof"));
it("should transform shared parameters", async () => await runTransformTest("shared"));
it("should transform definitions", async () => await runTransformTest("definition"));