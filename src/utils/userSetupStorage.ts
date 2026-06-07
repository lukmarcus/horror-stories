import type { SetupStep } from "../types";
import { createUserStorage } from "./userStorage";

const storage = createUserStorage<SetupStep[]>(
  (id) => `horror-stories:user-setup:${id}`,
  [],
  (steps) => steps.length === 0,
);

export const saveUserSetup = storage.save;
export const loadUserSetup = storage.load;
export const removeUserSetup = storage.remove;
