import { createUserStorage } from "./userStorage";

const storage = createUserStorage<Record<string, string>>(
  (id) => `horror-stories:user-images:${id}`,
  {},
  (images) => Object.keys(images).length === 0,
);

export const saveUserImages = storage.save;
export const loadUserImages = storage.load;
export const removeUserImages = storage.remove;
