import { useContext } from "react";
import { EditorContext } from "./editorTypes";
import type { EditorContextValue } from "./editorTypes";

export const useEditor = (): EditorContextValue => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};
