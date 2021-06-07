/**
 * Converts a function from `X` to `Y` to a function from `Promise<X>` to `Promise<Y>`.
 *
 * @param f is a function.
 * @returns a fully asynchronous version of the input function.
 */
export function map<X, Y>(
  f: (x: X) => Y,
): (x: Promise<X>) => Promise<Y> {
  return async (x) => f(await x);
}

/**
 * Converts a function from `X` to `Promise<Y>` to a function from `Promise<X>` to `Promise<Y>`.
 *
 * @param f is an asynchronous function.
 * @returns a fully asynchronous version of the input function.
 */
export function mapAsync<X, Y>(
  f: (x: X) => Promise<Y>,
): (x: Promise<X>) => Promise<Y> {
  return async (x) => f(await x);
}

/**
 * Combines two functions using classic function composition.
 *
 * @param f is the first function.
 * @param g is the second function.
 * @returns a function that is composed of the input functions.
 */
export function pipe<X, Y, Z>(
  f: (x: X) => Y,
  g: (y: Y) => Z,
): (x: X) => Z {
  return (x) => g(f(x));
}

/**
 * Converts a promise to a boolean representation of its resolution status.
 *
 * @param p is any promise.
 * @returns a promise that resolves to true if the input promise resolves, otherwise false.
 */
export async function getSuccess(p: Promise<unknown>) {
  try {
    await p;
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Async function that converts an async buffer to a string.
 */
export const getText = map(toText);
function toText(buf: Uint8Array): string {
  return new TextDecoder().decode(buf);
}

/**
 * Async function that converts an async buffer to an array of lines.
 */
export const getLines = map(toLines);
function toLines(buf: Uint8Array): string[] {
  return (toText(buf)).split("\n");
}

/**
 * Async function that converts an async buffer to an array of non-empty lines.
 */
export const getLinesNonEmpty = map(toNonEmptyLines);
function toNonEmptyLines(buf: Uint8Array): string[] {
  return (toLines(buf)).filter(Boolean);
}

/**
 * Async function that returns the first element of an async array, or fails if the array is empty.
 */
export const getFirst = map(toFirst);
function toFirst<T>(array: T[]): T {
  if (!array.length) {
    throw new Error(
      `The first item cannot be retrieved since the array is empty.`,
    );
  }
  return array[0];
}
