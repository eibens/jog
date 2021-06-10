async function run1(opts) {
  const process = Deno.run({
    cwd: opts.cwd,
    cmd: opts.cmd,
    env: opts.env,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  try {
    let input = opts.input || "";
    if (typeof input === "string") {
      input = new TextEncoder().encode(input);
    }
    process.stdin.write(input);
    const [stderr, stdout, status] = await Promise.all([
      process.stderrOutput(),
      process.output(),
      process.status(),
    ]);
    if (status.success) {
      return stdout;
    } else {
      const error = new TextDecoder().decode(stderr);
      throw new Error(error);
    }
  } finally {
    process.stdin.close();
    process.close();
  }
}
export { run1 as run };
function out1(opts) {
  return opts.map(run1(opts));
}
export { out1 as out };
function map1(f) {
  return async (x) => f(await x);
}
function mapAsync1(f) {
  return async (x) => f(await x);
}
function pipe1(f, g) {
  return (x) => g(f(x));
}
async function getSuccess1(p) {
  try {
    await p;
    return true;
  } catch (_) {
    return false;
  }
}
const getText1 = map1(toText);
function toText(buf) {
  return new TextDecoder().decode(buf);
}
const getLines1 = map1(toLines);
function toLines(buf) {
  return toText(buf).split("\n");
}
const getLinesNonEmpty1 = map1(toNonEmptyLines);
function toNonEmptyLines(buf) {
  return toLines(buf).filter(Boolean);
}
const getFirst1 = map1(toFirst);
function toFirst(array) {
  if (!array.length) {
    throw new Error(
      `The first item cannot be retrieved since the array is empty.`,
    );
  }
  return array[0];
}
export { map1 as map };
export { mapAsync1 as mapAsync };
export { pipe1 as pipe };
export { getSuccess1 as getSuccess };
export { getText1 as getText };
export { getLines1 as getLines };
export { getLinesNonEmpty1 as getLinesNonEmpty };
export { getFirst1 as getFirst };
