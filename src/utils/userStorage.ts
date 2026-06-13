/**
 * Creates a set of save/load/remove functions for a given localStorage key pattern.
 * @param keyFn   Generates the storage key from a scenario ID
 * @param empty   Value returned when nothing is stored
 * @param isEmpty Optional predicate — when true, removes the key instead of saving
 */
export function createUserStorage<T>(
  keyFn: (scenarioId: string) => string,
  empty: T,
  isEmpty?: (val: T) => boolean,
) {
  function save(scenarioId: string, data: T): void {
    try {
      if (isEmpty?.(data)) {
        localStorage.removeItem(keyFn(scenarioId));
      } else {
        localStorage.setItem(keyFn(scenarioId), JSON.stringify(data));
      }
    } catch {
      // ignore storage errors
    }
  }

  function load(scenarioId: string): T {
    try {
      const raw = localStorage.getItem(keyFn(scenarioId));
      if (!raw) return empty;
      return JSON.parse(raw) as T;
    } catch {
      return empty;
    }
  }

  function remove(scenarioId: string): void {
    try {
      localStorage.removeItem(keyFn(scenarioId));
    } catch {
      // ignore storage errors
    }
  }

  return { save, load, remove };
}
