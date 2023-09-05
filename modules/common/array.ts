/**
 * @param arr array
 * @param condition true to delete
 * @returns array after remove
 */
export function arrayAfterRemove<T>(
  arr: T[],
  condition: (e: T) => boolean
): T[] {
  const ret: T[] = []
  for (const e of arr) {
    if (!condition(e)) {
      ret.push(e)
    }
  }
  return ret
}
