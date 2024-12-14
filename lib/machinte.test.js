import test from "ava";
import { Statement } from "./machine.js";

test("getParameters should return for two parameters", async (t) => {
  t.deepEqual(Statement.getParameters("mul(1,2)"), ["1", "2"]);
});

test("getParameters should return for no parameter", async (t) => {
  t.deepEqual(Statement.getParameters("mul()"), []);
});
