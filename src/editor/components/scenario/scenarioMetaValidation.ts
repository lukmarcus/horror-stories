import { useEditor } from "../../context/useEditor";
import type { Scenario } from "../../../types";

export const TITLE_MAX = 80;
export const DESC_MAX = 300;
export const PLAYER_MIN = 1;
export const PLAYER_MAX = 9;
export const DURATION_MAX = 999;

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateMeta(meta: Scenario): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!meta.title.trim()) errors.title = "Tytuł jest wymagany.";
  else if (meta.title.length > TITLE_MAX)
    errors.title = `Maksymalnie ${TITLE_MAX} znaków.`;
  if (meta.description && meta.description.length > DESC_MAX)
    errors.description = `Maksymalnie ${DESC_MAX} znaków.`;
  if (
    meta.minPlayerCount != null &&
    (meta.minPlayerCount < PLAYER_MIN || meta.minPlayerCount > PLAYER_MAX)
  )
    errors.minPlayerCount = `Wartość od ${PLAYER_MIN} do ${PLAYER_MAX}.`;
  if (
    meta.maxPlayerCount != null &&
    (meta.maxPlayerCount < PLAYER_MIN || meta.maxPlayerCount > PLAYER_MAX)
  )
    errors.maxPlayerCount = `Wartość od ${PLAYER_MIN} do ${PLAYER_MAX}.`;
  if (
    meta.minPlayerCount != null &&
    meta.maxPlayerCount != null &&
    meta.maxPlayerCount < meta.minPlayerCount
  )
    errors.maxPlayerCount = "Maksimum nie może być mniejsze niż minimum.";
  if (
    meta.duration != null &&
    (meta.duration < 1 || meta.duration > DURATION_MAX)
  )
    errors.duration = `Wartość od 1 do ${DURATION_MAX}.`;
  return errors;
}

export function useMetaErrors(): Record<string, string> {
  const { state } = useEditor();
  const meta = state.scenario?.meta;
  if (!meta) return {};
  return validateMeta(meta);
}
