# [jog]

> [jog] — _also known as a leisurely paced run_ — is a simplified API for
> running sub-processes in TypeScript for [Deno], implemented as a thin wrapper
> around `Deno.run`. Stream access to `stdout`, `stdin`, and `stderr`, as well
> as resource management, is abstracted away. Instead, the data for `stdin` can
> be specified once as a buffer, the data from `stdout` is returned
> asynchronously as a buffer or mapped to a custom type, and `stderr` is thrown
> as an error message if the process terminates unsuccessfully.
> <br/> — [jog on GitHub]

![License](https://img.shields.io/github/license/eibens/jog)
![Tag](https://img.shields.io/github/v/tag/eibens/jog)
![Build status](https://img.shields.io/github/workflow/status/eibens/jog/build)
![Code coverage](https://img.shields.io/codecov/c/github/eibens/jog)

# [Comparison]

The following table summarizes the differences between the native [Deno] API and
[jog]:

| `Deno.run`                     | [run.ts]                |
| ------------------------------ | ----------------------- |
| `cmd` / `cwd` / `env`          | _same_                  |
| `stdin`                        | `Uint8Array` / `string` |
| `stdout` / `output` / `status` | `Promise<Uint8Array>`   |
| `stderr` / `stderrOutput`      | `throw new Error`       |

# [mod.ts module]

The [mod.ts] module exports all other modules:

- [run.ts module]
- [out.ts module]
- [map.ts module]

# [run.ts module]

The [run.ts] module defines the `run` function which starts a sub-process and
returns its result asynchronously. The required `cmd` and optional `cwd` and
`env` options work exactly like their `Deno.run` counterparts. The examples
assume that the [mockcli.ts] module is installed as `mockcli` on the command
line. This example demonstrates how `run` can be used to get data from `stdout`:

```ts
import { Run, run } from "./run.ts";

// Define a process.
const command: Run = {
  cmd: ["mockcli", "answer"],
};

// Run the process.
const buffer: Uint8Array = await run(command);

// print: "42"
Deno.stdout.write(buffer);
```

Data for `stdin` can be specified with the `input` option, either as a `string`
or as a `Uint8Array`:

```ts
import { run } from "./run.ts";

const buffer = await run({
  cmd: ["mockcli", "echo"],
  input: "let's jog!",
});

// print: "let's jog!"
Deno.stdout.write(buffer);
```

If the process exits with an error, an `Error` is thrown and the contents of
`stderr` are used as the error message:

```ts
import { run } from "./run.ts";

try {
  await run({
    cmd: ["mockcli", "fail"],
    input: "oh no!",
  });
} catch (error) {
  // print: "oh no!"
  console.log(error.message);
}
```

# [out.ts module]

The [out.ts] module defines the `out` function, which extends the `run` API with
an asynchronous mapping function that is applied to the `stdout` buffer. For
example, instead of the buffer itself, one could return its length:

```ts
import { Out, out } from "./out.ts";

// Define a process with output mapping.
const command: Out<number> = {
  cmd: ["mockcli", "answer"],
  map: async (x: Promise<Uint8Array>) => (await x).length,
};

// Run the process.
const length: number = await out(command);

// print: 3 (buffer contains "42\n")
console.log(length);
```

# [map.ts module]

The [map.ts] module defines common mappings that can be used with the `out`
function, such as `getLines`, `getLinesNonEmpty`, `getFirst`, and `getSuccess`.
For example, `getSuccess` can be used to check whether a process succeeds:

```ts
import { out } from "./out.ts";
import { getSuccess } from "./map.ts";

const worked = await out({
  cmd: ["mockcli", "fail"],
  map: getSuccess,
});

// print: false
console.log(worked);
```

Custom mapping functions can be defined with the `map` and `mapAsync`
convenience functions. The `pipe` function can be used for chaining two mapping
functions. In this example, `out` returns the first line of `stdout` in
uppercase letters:

```ts
import { out } from "./out.ts";
import { map, pipe } from "./map.ts";

const result = await out({
  cmd: ["mockcli", "echo"],
  input: "first\nsecond",
  map: pipe(
    pipe(getLines, getFirst),
    map((x) => x.toUpperCase()),
  ),
});

// print: "result"
console.log(line);
```

[jog]: #jog
[jog on GitHub]: https://github.com/eibens/jog
[Deno]: https://deno.land
[Command Pattern]: https://en.wikipedia.org/wiki/Command_pattern
[mod.ts module]: #mod.ts-module
[run.ts module]: #run.ts-module
[out.ts module]: #out.ts-module
[map.ts module]: #map.ts-module
[mod.ts]: mod.ts
[run.ts]: run.ts
[out.ts]: out.ts
[map.ts]: map.ts
[mockcli.ts]: mockcli.ts
[comparison]: #comparison
