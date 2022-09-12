import {
  animals1,
  death1,
  flags,
  foodAndDrink1,
  nostalgia,
  red,
  spaceDucks,
  sportActivityAndMusic1,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";
import { isSpaceDucksVariant } from "../../../utils/local-storage";
import { nostalgiaName } from "../../new-game-screen/game-preconfigs/preconfigs";

export function getDefaultSet() {
  return isSpaceDucksVariant() ? spaceDucks : death1;
}

const _preselections = [
  getDefaultSet(),
  animals1,
  foodAndDrink1,
  sportActivityAndMusic1,
  red,
  flags,
  nostalgia,
];

const _preselectionsNames = [
  isSpaceDucksVariant() ? "Space Ducks" : "Death",
  "Animals",
  "Food & Drink",
  "Sport, Activity & Music",
  "All red",
  "Flags",
  nostalgiaName,
];

export const preselections = _preselections.map((set, index) => ({
  id: splitEmojis(set)[0],
  name: _preselectionsNames[index],
  emojis: set,
}));
