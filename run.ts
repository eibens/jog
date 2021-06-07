/**
 * Configuration for a sub-process.
 */
export type Run = {
  /**
   * The arguments for the process.
   */
  cmd: string[];

  /**
   * The directory in which the process should run.
   */
  cwd?: string;

  /**
   * A map of environment variables for the process.
   */
  env?: Record<string, string>;

  /**
   * An optional input string or buffer that will be written to `stdin`.
   */
  input?: string | Uint8Array;
};

/**
 * Runs a sub-process and retrieves the output.
 *
 * @param opts is the configuration for the sub-process.
 * @returns a buffer that contains the data read from `stdin`.
 * @throws if the sub-process terminates with an error. The message is the contents of `stderr`.
 */
export async function run(opts: Run): Promise<Uint8Array> {
  const process = Deno.run({
    cwd: opts.cwd,
    cmd: opts.cmd,
    env: opts.env,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  try {
    // Write data to stdin.
    let input = opts.input || "";
    if (typeof input === "string") {
      input = new TextEncoder().encode(input);
    }
    process.stdin.write(input);

    // Read streams to close them.
    // For info see: https://github.com/denoland/deno/issues/4568#issuecomment-772463496
    const [stderr, stdout, status] = await Promise.all([
      process.stderrOutput(),
      process.output(),
      process.status(),
    ]);

    // Return stdout, or throw error.
    if (status.success) {
      return stdout;
    } else {
      const error = new TextDecoder().decode(stderr);
      throw new Error(error);
    }
  } finally {
    // Avoid leaking resources.
    process.stdin.close();
    process.close();
  }
}
