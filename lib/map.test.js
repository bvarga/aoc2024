import test from "ava";
import { Map } from "./map.js";

test("should get pixels of map", async (t) => {
  const map = new Map();
  map.load("12\n34");

  t.is(map.data(0, 0), "1");
  t.is(map.data(1, 0), "2");
  t.is(map.data(0, 1), "3");
  t.is(map.data(1, 1), "4");
});

test("should return empty size", async (t) => {
  t.deepEqual(new Map().size, { x: 0, y: 0 });
});

test("should return undefined for invalid values", async (t) => {
  t.is(new Map().data(0, 0), undefined);
});

test("should return size of map", async (t) => {
  const map = new Map();
  map.load("12\n34");
  t.deepEqual(map.size, { x: 2, y: 2 });
});
