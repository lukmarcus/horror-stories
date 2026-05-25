/** Returns items from `list` whose string value contains `value` (case-sensitive).
 *  If `value` is empty/whitespace, returns the full list. */
export function filterIds(value: string, list: string[]): string[] {
  const v = value.trim();
  return v ? list.filter((id) => id.includes(v)) : list;
}
