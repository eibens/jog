# jog - Simplified Process Runner for Deno

> [jog] — _also known as a leisurely paced run_ — is a simplified API for
> running sub-processes in TypeScript for [Deno], implemented as a thin wrapper
> around `Deno.run`.

[![License][license-shield]](LICENSE) [![Deno doc][deno-doc-shield]][deno-doc]
[![Deno module][deno-land-shield]][deno-land]
[![Github tag][github-shield]][github] [![Build][build-shield]][build]
[![Code coverage][coverage-shield]][coverage]

# Motivation

Using the native [Deno] function `Deno.run` can be tedious, as we must correctly
configure the IO streams and remember to cleanup resources. In [jog] access to
`stdout`, `stdin`, and `stderr`, as well as resource management is abstracted
away. Instead, the data for `stdin` can be specified once as a buffer, the data
from `stdout` is returned asynchronously as a buffer or mapped to a custom type,
and `stderr` is thrown as an error message if the process terminates
unsuccessfully. The following table summarizes the differences between the
native [Deno] API and [jog]:

| `Deno.run`                     | `jog.run`               |
| ------------------------------ | ----------------------- |
| `cmd` / `cwd` / `env`          | _same_                  |
| `stdin`                        | `Uint8Array` / `string` |
| `stdout` / `output` / `status` | `Promise<Uint8Array>`   |
| `stderr` / `stderrOutput`      | `try`-`catch`           |

# [mod.ts]

The [mod.ts] module exports all other modules.

# [run.ts]

The `run` function starts a sub-process and returns its result asynchronously.
The required `cmd` and optional `cwd` and `env` options work exactly like their
`Deno.run` counterparts. The examples assume that the [mockcli.ts] module is
installed as `mockcli` on the command line. This example demonstrates how `run`
can be used to get data from `stdout`:

```ts
import { Run, run } from "https://deno.land/x/jog/run.ts";

// Define a process.
const command: Run = {
  cmd: ["mockcli", "answer"],
};

// Run the process.
const buffer: Uint8Array = await run(command);

// print: "42\n"
Deno.stdout.write(buffer);
```

Data for `stdin` can be specified with the `input` option, either as a `string`
or as a `Uint8Array`:

```ts
import { run } from "https://deno.land/x/jog/run.ts";

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
import { run } from "https://deno.land/x/jog/run.ts";

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

# [out.ts]

The `out` function extends the `run` API with an asynchronous mapping function
that is applied to the `stdout` buffer. For example, instead of the buffer
itself, one could return its length:

```ts
import { Out, out } from "https://deno.land/x/jog/out.ts";

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

# [map.ts]

The functions `getLines`, `getLinesNonEmpty`, `getFirst`, and `getSuccess` are
common mappings that can be used with the `out` function. For example,
`getSuccess` can be used to check whether a process succeeds:

```ts
import { out } from "https://deno.land/x/jog/out.ts";
import { getSuccess } from "https://deno.land/x/jog/map.ts";

const worked = await out({
  cmd: ["mockcli", "fail"],
  input: "oh no!",
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
import { out } from "https://deno.land/x/jog/out.ts";
import { getFirst, getLines, map, pipe } from "https://deno.land/x/jog/map.ts";

const result = await out({
  cmd: ["mockcli", "echo"],
  input: "first\nsecond",
  map: pipe(
    pipe(getLines, getFirst),
    map((x) => x.toUpperCase()),
  ),
});

// print: "FIRST"
console.log(result);
```

# That's it!

Now, [jog home][github].

[jog]: #
[Deno]: https://deno.land
[mod.ts]: mod.ts
[run.ts]: run.ts
[out.ts]: out.ts
[map.ts]: map.ts
[mockcli.ts]: mockcli.ts

<!-- badges -->

[github]: https://github.com/eibens/jog
[github-shield]: https://img.shields.io/github/v/tag/eibens/jog?label&logo=github
[coverage-shield]: https://img.shields.io/codecov/c/github/eibens/jog?logo=codecov&label
[license-shield]: https://img.shields.io/github/license/eibens/jog?color=informational
[coverage]: https://codecov.io/gh/eibens/jog
[build]: https://github.com/eibens/jog/actions/workflows/ci.yml
[build-shield]: https://img.shields.io/github/workflow/status/eibens/jog/ci?logo=github&label
[deno-doc]: https://doc.deno.land/https/deno.land/x/jog/mod.ts
[deno-doc-shield]: https://img.shields.io/badge/doc-informational?logo=deno
[deno-land]: https://deno.land/x/jog
[deno-land-shield]: https://img.shields.io/badge/x/jog-informational?logo=deno&label
