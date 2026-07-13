import type { Enemy } from "../../types";
import klaunData from "./klaun.json";
import wilkolakData from "./wilkolak.json";

export const ENEMIES: Record<string, Enemy> = {
  klaun: klaunData as Enemy,
  wilkolak: wilkolakData as Enemy,
};

export const getEnemy = (id: string): Enemy | undefined => ENEMIES[id];
