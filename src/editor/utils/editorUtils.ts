/** Returns items from `list` whose string value contains `value` (case-sensitive).
 *  If `value` is empty/whitespace, returns the full list. */
export function filterIds(value: string, list: string[]): string[] {
  const v = value.trim();
  return v ? list.filter((id) => id.includes(v)) : list;
}

/** Sorts paragraph IDs numerically when possible, falls back to localeCompare. */
export function sortParagraphIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
}
