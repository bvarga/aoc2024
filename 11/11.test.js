import test from "ava";

import { trafo } from "./11.js";

test("trafo should return 1 for 0", async (t) => {
  t.deepEqual(trafo("0"), ["1"]);
});

test("trafo should return correct value for even length values", async (t) => {
  t.deepEqual(trafo("12"), ["1", "2"]);
});

test("trafo should return correct value for odd length values", async (t) => {
  t.deepEqual(trafo("2"), ["4048"]);
});
