import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { join } from "https://deno.land/std@0.91.0/path/mod.ts";
import { getText } from "./map.ts";
import { run } from "./run.ts";
import { copy } from "https://deno.land/std@0.143.0/streams/conversion.ts";

const mockcliFile = "mockcli.ts";
const denoRun = ["deno", "run", "--allow-read"];
const mockcli = [...denoRun, mockcliFile];

async function answer() {
  return await getText(run({
    cmd: [...mockcli, "answer"],
  }));
}

async function echo(input?: string | Uint8Array) {
  return await getText(run({
    cmd: [...mockcli, "echo"],
    input,
  }));
}

async function fail(input: string) {
  return await run({
    cmd: [...mockcli, "fail"],
    input,
  });
}

Deno.test("runs a command and returns the output", async () => {
  assertEquals(
    await answer(),
    "42\n",
  );
});

Deno.test("run passes string input to stdin", async () => {
  assertEquals(
    await echo("hello, world"),
    "hello, world",
  );
});

Deno.test("run passes buffer input to stdin", async () => {
  const buf = new TextEncoder().encode("hello, world");
  assertEquals(
    await echo(buf),
    "hello, world",
  );
});

Deno.test("run throws error if process fails", async () => {
  await assertThrowsAsync(
    async () => await fail("oh no!"),
    Error,
    "oh no!",
  );
});

Deno.test("run uses the specified CWD", async () => {
  // For testing in another CWD we copy the mockcli file to the temporary working dir.
  const cwd = await Deno.makeTempDir();
  const tmpMockcli = join(cwd, mockcliFile);
  const dst = await Deno.create(tmpMockcli);
  const src = await Deno.open(mockcliFile);
  try {
    await copy(src, dst);
    assertEquals(
      await getText(run({
        cmd: [...denoRun, tmpMockcli, "cwd"],
        cwd,
      })),
      cwd + "\n",
    );
  } finally {
    dst.close();
    src.close();
    await Deno.remove(cwd, { recursive: true });
  }
});
