import type { SetupData } from "../types";
import { createUserStorage } from "./userStorage";

const storage = createUserStorage<SetupData>(
  (id) => `horror-stories:user-setup:${id}`,
  { steps: [] },
  (data) => data.steps.length === 0 && !data.startParagraphId,
);

export const saveUserSetup = storage.save;
export const loadUserSetup = storage.load;
export const removeUserSetup = storage.remove;
