import { copy } from "https://deno.land/std@0.143.0/streams/conversion.ts";

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

  switch (Deno.args[0]) {
    case "answer": {
      await writeTextToStdout("42\n");
      return opts.exit(0);
    }
    case "echo": {
      await copy(Deno.stdin, Deno.stdout);
      return opts.exit(0);
    }
    case "fail": {
      await copy(Deno.stdin, Deno.stderr);
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
