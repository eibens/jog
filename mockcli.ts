const help = `
usage: deno run [--allow-read] mockcli.ts <command>

available commands:
\tanswer
\t\twrites the line "42" to stdout
\techo
\t\twrites stdin to stdout
\tfail
\t\twrites stdin to stderr and returns an error code
\tcwd
\t\twrites the CWD as a line to stdout
\t\t--allow-read permission must be used
`.trimStart();

if (import.meta.main) {
  await main(Deno);
}

export async function main(opts: {
  args: string[];
  stdin: Deno.Reader;
  stdout: Deno.Writer;
  stderr: Deno.Writer;
  cwd: () => string;
  exit: (n: number) => void;
}) {
  async function writeTextToStdout(text: string) {
    const answer = new TextEncoder().encode(text);
    await opts.stdout.write(answer);
  }

  async function writeStdinTo(writer: Deno.Writer) {
    // For some reason using `await Deno.copy(Deno.stdin, Deno.stdout)`
    // makes the process hang forever. Should be investigated further.
    const buffer = new Uint8Array(1024);
    const n = <number> await opts.stdin.read(buffer);
    await writer.write(buffer.subarray(0, n));
  }

  switch (Deno.args[0]) {
    case "answer": {
      await writeTextToStdout("42\n");
      return opts.exit(0);
    }
    case "echo": {
      await writeStdinTo(opts.stdout);
      return opts.exit(0);
    }
    case "fail": {
      await writeStdinTo(opts.stderr);
      return opts.exit(-1);
    }
    case "cwd": {
      await writeTextToStdout(opts.cwd() + "\n");
      return opts.exit(0);
    }
    default: {
      await writeTextToStdout(help);
      return opts.exit(0);
    }
  }
}
