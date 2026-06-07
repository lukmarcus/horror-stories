import type { EditorParagraph } from "../editor/context/editorTypes";
import { createUserStorage } from "./userStorage";

const storage = createUserStorage<EditorParagraph[]>(
  (id) => `horror-stories:user-paragraphs:${id}`,
  [],
);

export const saveUserParagraphs = storage.save;
export const loadUserParagraphs = storage.load;
export const removeUserParagraphs = storage.remove;
