type TextEl = HTMLTextAreaElement | HTMLInputElement;

/**
 * Inserts a snippet at the cursor position, replacing any active selection.
 */
export function insertAtCursor(
  el: TextEl | null,
  value: string,
  onChange: (v: string) => void,
  snippet: string,
): void {
  if (!el) return;
  const pos = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? pos;
  onChange(value.slice(0, pos) + snippet + value.slice(end));
  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = pos + snippet.length;
  });
}

/**
 * Wraps the current selection with before/after strings.
 */
export function wrapSelection(
  el: TextEl | null,
  value: string,
  onChange: (v: string) => void,
  before: string,
  after: string,
): void {
  if (!el) return;
  const s = el.selectionStart ?? 0;
  const e = el.selectionEnd ?? 0;
  const sel = value.slice(s, e);
  onChange(value.slice(0, s) + before + sel + after + value.slice(e));
  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = s + before.length;
    el.selectionEnd = e + before.length;
  });
}

/**
 * Inserts a snippet at the cursor position, optionally placing cursor before
 * the last `cursorFromEnd` characters of the snippet.
 */
export function insertSnippet(
  el: TextEl | null,
  value: string,
  onChange: (v: string) => void,
  snippet: string,
  cursorFromEnd?: number,
): void {
  if (!el) return;
  const pos = el.selectionStart ?? value.length;
  onChange(value.slice(0, pos) + snippet + value.slice(pos));
  const cursorPos =
    cursorFromEnd != null
      ? pos + snippet.length - cursorFromEnd
      : pos + snippet.length;
  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = cursorPos;
  });
}
