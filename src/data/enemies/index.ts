import type { Enemy } from "../../types";
import klaunData from "./klaun.json";

export const ENEMIES: Record<string, Enemy> = {
  klaun: klaunData as Enemy,
};

export const getEnemy = (id: string): Enemy | undefined => ENEMIES[id];
