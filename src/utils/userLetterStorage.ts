import type { LetterToken } from "../types";
import { createUserStorage } from "./userStorage";

const storage = createUserStorage<LetterToken[]>(
  (id) => `horror-stories:user-letters:${id}`,
  [],
  (letters) => letters.length === 0,
);

export const saveUserLetters = storage.save;
export const loadUserLetters = storage.load;
export const removeUserLetters = storage.remove;
