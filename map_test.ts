import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import {
  getFirst,
  getLines,
  getLinesNonEmpty,
  getSuccess,
  getText,
  map,
  mapAsync,
  pipe,
} from "./map.ts";

Deno.test("getFirst gets first element", async () => {
  assertEquals(
    await getFirst(Promise.resolve([1, 2, 3])),
    1,
  );
});

Deno.test("getFirst throws if array is empty", async () => {
  await assertThrowsAsync(
    () => getFirst(Promise.resolve([])),
    Error,
    "empty",
  );
});

Deno.test("getLines preserves empty lines", async () => {
  const buf = new TextEncoder().encode("hello\n\nworld");
  assertEquals(
    await getLines(Promise.resolve(buf)),
    ["hello", "", "world"],
  );
});

Deno.test("getLinesNonEmpty removes empty lines", async () => {
  const buf = new TextEncoder().encode("hello\n\nworld");
  assertEquals(
    await getLinesNonEmpty(Promise.resolve(buf)),
    ["hello", "world"],
  );
});

Deno.test("getSuccess is true if promise resolves", async () => {
  assertEquals(
    await getSuccess(Promise.resolve(42)),
    true,
  );
});

Deno.test("getSuccess is false if promise is rejected", async () => {
  assertEquals(
    await getSuccess(Promise.reject(42)),
    false,
  );
});

Deno.test("getText converts buffer to text", async () => {
  const buf = new TextEncoder().encode("hello");
  assertEquals(
    await getText(Promise.resolve(buf)),
    "hello",
  );
});

Deno.test("map resolves correctly", async () => {
  assertEquals(
    await map((x: number) => x * 2)(Promise.resolve(21)),
    42,
  );
});

Deno.test("mapAsync resolves correctly", async () => {
  assertEquals(
    await mapAsync((x: number) => Promise.resolve(x * 2))(Promise.resolve(21)),
    42,
  );
});

Deno.test("pipe combines two function", () => {
  assertEquals(
    pipe((x: number) => x * 2, (x) => x * 3)(2),
    12,
  );
});
