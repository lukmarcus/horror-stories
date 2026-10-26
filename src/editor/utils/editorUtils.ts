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

export interface GroupableEntry {
  id: string;
  isAlias: boolean;
}

export interface GroupedEntry<T extends GroupableEntry> {
  entry: T;
  isChild: boolean;
  parentId: string | null;
}

/**
 * Walks a list of sorted paragraph entries and tags lettered sibling IDs
 * (e.g. "100a" right after "100") as children of the preceding bare numeric ID.
 * Aliases and lettered IDs with no matching preceding parent are left as standalone.
 */
export function groupParagraphEntries<T extends GroupableEntry>(
  entries: T[],
): GroupedEntry<T>[] {
  let currentBase: string | null = null;
  return entries.map((entry) => {
    if (entry.isAlias) return { entry, isChild: false, parentId: null };

    const match = /^(\d+)[a-z]+$/.exec(entry.id);
    if (match && match[1] === currentBase) {
      return { entry, isChild: true, parentId: currentBase };
    }

    currentBase = /^\d+$/.test(entry.id) ? entry.id : null;
    return { entry, isChild: false, parentId: null };
  });
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

/**
 * Given a bare numeric paragraph ID that already exists, suggests the next
 * free lettered child ID (e.g. "100" with "100a" taken → "100b").
 * Returns null if `baseId` isn't a bare number, doesn't exist in `existingIds`,
 * or all 26 letters are already taken.
 */
export function suggestNextLetterChild(
  baseId: string,
  existingIds: string[],
): string | null {
  if (!/^\d+$/.test(baseId) || !existingIds.includes(baseId)) return null;
  const used = new Set(existingIds);
  for (const letter of LETTERS) {
    const candidate = `${baseId}${letter}`;
    if (!used.has(candidate)) return candidate;
  }
  return null;
}
