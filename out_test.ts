import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { out } from "./out.ts";

Deno.test("out applies mapping function", async () => {
  assertEquals(
    await out({
      cmd: ["deno", "run", "mockcli.ts", "answer"],
      map: async (x) => (await x).length,
    }),
    3,
  );
});
