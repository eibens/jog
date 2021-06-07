import { Run, run } from "./run.ts";

/**
 * Configuration for a sub-process that includes an output mapping.
 */
export type Out<Y> = Run & {
  map: (buffer: Promise<Uint8Array>) => Promise<Y>;
};

/**
 * Run a sub-process with a custom output mapping.
 *
 * @param opts is the configuration for the sub-process.
 * @returns the result of the output mapping applied to the process output.
 * @throws if the sub-process terminated unsuccessfully.
 * @throws if the output mapping threw an error.
 */
export function out<Y>(opts: Out<Y>): Promise<Y> {
  return opts.map(run(opts));
}
