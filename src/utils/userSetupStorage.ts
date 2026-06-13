import type { SetupData } from "../types";
import { createUserStorage } from "./userStorage";

const storage = createUserStorage<SetupData>(
  (id) => `horror-stories:user-setup:${id}`,
  { pages: [] },
  (data) => data.pages.length === 0 && !data.choices?.length,
);

export const saveUserSetup = storage.save;
export const loadUserSetup = storage.load;
export const removeUserSetup = storage.remove;
