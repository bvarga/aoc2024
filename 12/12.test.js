import test from "ava";

import { isNext } from "./12.js";

test("trafo should return 1 for 0", async (t) => {

  t.is(isNext({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 1,
  }, { x1: 1, y1: 0, x2: 1, y2: 1}), true);
});
