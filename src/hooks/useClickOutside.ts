import { useEffect, useRef } from "react";
import type React from "react";

/**
 * Attaches a `mousedown` listener to the document that calls `onClickOutside`
 * when a click occurs outside the returned ref element.
 * The listener is only active while `isActive` is true.
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  isActive: boolean,
  onClickOutside: () => void,
): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onClickOutside);

  // Sync callback ref after each render (not during render — React 19 requirement)
  useEffect(() => {
    callbackRef.current = onClickOutside;
  });

  useEffect(() => {
    if (!isActive) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isActive]);

  return ref;
}
