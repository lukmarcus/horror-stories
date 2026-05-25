import { describe, it, expect, vi } from "vitest";
import { insertAtCursor, wrapSelection, insertSnippet } from "./textInsert";

// jsdom doesn't call requestAnimationFrame callbacks automatically
vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
  cb(0);
  return 0;
});

function makeInput(
  value: string,
  selStart: number,
  selEnd = selStart,
): HTMLInputElement {
  const el = document.createElement("input");
  el.value = value;
  el.selectionStart = selStart;
  el.selectionEnd = selEnd;
  return el;
}

function makeTextarea(
  value: string,
  selStart: number,
  selEnd = selStart,
): HTMLTextAreaElement {
  const el = document.createElement("textarea");
  el.value = value;
  el.selectionStart = selStart;
  el.selectionEnd = selEnd;
  return el;
}

describe("insertAtCursor", () => {
  it("inserts snippet at cursor position", () => {
    const el = makeInput("hello world", 5);
    const onChange = vi.fn();
    insertAtCursor(el, "hello world", onChange, "!");
    expect(onChange).toHaveBeenCalledWith("hello! world");
  });

  it("replaces selected text with snippet", () => {
    const el = makeInput("hello world", 6, 11);
    const onChange = vi.fn();
    insertAtCursor(el, "hello world", onChange, "there");
    expect(onChange).toHaveBeenCalledWith("hello there");
  });

  it("inserts at start when cursor is at position 0", () => {
    const el = makeInput("abc", 0);
    const onChange = vi.fn();
    insertAtCursor(el, "abc", onChange, ">>>");
    expect(onChange).toHaveBeenCalledWith(">>>abc");
  });

  it("inserts at end when cursor is at end", () => {
    const el = makeInput("abc", 3);
    const onChange = vi.fn();
    insertAtCursor(el, "abc", onChange, "!");
    expect(onChange).toHaveBeenCalledWith("abc!");
  });

  it("works with textarea element", () => {
    const el = makeTextarea("line1\nline2", 6);
    const onChange = vi.fn();
    insertAtCursor(el, "line1\nline2", onChange, ">>>");
    expect(onChange).toHaveBeenCalledWith("line1\n>>>line2");
  });

  it("does nothing when el is null", () => {
    const onChange = vi.fn();
    insertAtCursor(null, "abc", onChange, "!");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("updates cursor position after insert", () => {
    const el = makeInput("abc", 1);
    insertAtCursor(el, "abc", vi.fn(), "XX");
    expect(el.selectionStart).toBe(3);
    expect(el.selectionEnd).toBe(3);
  });
});

describe("wrapSelection", () => {
  it("wraps selected text with before/after", () => {
    const el = makeInput("hello world", 6, 11);
    const onChange = vi.fn();
    wrapSelection(el, "hello world", onChange, "<b>", "</b>");
    expect(onChange).toHaveBeenCalledWith("hello <b>world</b>");
  });

  it("inserts empty wrap at cursor when nothing selected", () => {
    const el = makeInput("abc", 1, 1);
    const onChange = vi.fn();
    wrapSelection(el, "abc", onChange, "<b>", "</b>");
    expect(onChange).toHaveBeenCalledWith("a<b></b>bc");
  });

  it("preserves text outside selection", () => {
    const el = makeInput("prefix SEL suffix", 7, 10);
    const onChange = vi.fn();
    wrapSelection(el, "prefix SEL suffix", onChange, "[", "]");
    expect(onChange).toHaveBeenCalledWith("prefix [SEL] suffix");
  });

  it("works with textarea", () => {
    const el = makeTextarea("foo bar baz", 4, 7);
    const onChange = vi.fn();
    wrapSelection(el, "foo bar baz", onChange, "<em>", "</em>");
    expect(onChange).toHaveBeenCalledWith("foo <em>bar</em> baz");
  });

  it("does nothing when el is null", () => {
    const onChange = vi.fn();
    wrapSelection(null, "abc", onChange, "<b>", "</b>");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("positions cursor inside wrapping tags after insertion", () => {
    const el = makeInput("abc", 1, 2);
    wrapSelection(
      el,
      "abc",
      (v) => {
        el.value = v;
      },
      "<b>",
      "</b>",
    );
    // selectionStart = s + before.length = 1 + 3 = 4
    expect(el.selectionStart).toBe(4);
    // selectionEnd = e + before.length = 2 + 3 = 5
    expect(el.selectionEnd).toBe(5);
  });
});

describe("insertSnippet", () => {
  it("inserts snippet at cursor position", () => {
    const el = makeInput("hello world", 5);
    const onChange = vi.fn();
    insertSnippet(el, "hello world", onChange, "!");
    expect(onChange).toHaveBeenCalledWith("hello! world");
  });

  it("places cursor after snippet by default", () => {
    const el = makeInput("ab", 1);
    insertSnippet(
      el,
      "ab",
      (v) => {
        el.value = v;
      },
      "XYZ",
    );
    expect(el.selectionStart).toBe(4);
    expect(el.selectionEnd).toBe(4);
  });

  it("places cursor cursorFromEnd characters before end of snippet", () => {
    const el = makeInput("ab", 1);
    insertSnippet(el, "ab", vi.fn(), '""', 1);
    // snippet length=2, cursorFromEnd=1 → pos + 2 - 1 = 2
    expect(el.selectionStart).toBe(2);
    expect(el.selectionEnd).toBe(2);
  });

  it("inserts at end of value when at end position", () => {
    const el = makeInput("abc", 3);
    const onChange = vi.fn();
    insertSnippet(el, "abc", onChange, ">>>");
    expect(onChange).toHaveBeenCalledWith("abc>>>");
  });

  it("does not replace existing selection (inserts at selectionStart)", () => {
    const el = makeInput("hello world", 6, 11);
    const onChange = vi.fn();
    insertSnippet(el, "hello world", onChange, "there");
    // inserts at pos=6, keeps rest including "world"
    expect(onChange).toHaveBeenCalledWith("hello thereworld");
  });

  it("does nothing when el is null", () => {
    const onChange = vi.fn();
    insertSnippet(null, "abc", onChange, "!");
    expect(onChange).not.toHaveBeenCalled();
  });
});
