import {
  animals1,
  clothingAndAccessories1,
  death1,
  flags,
  foodAndDrink1,
  red,
  spaceDucks,
  sportActivityAndMusic1,
  travelPlacesAndTransport1,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";
import { isSpaceDucksVariant } from "../../../utils/local-storage";

export function getDefaultSet() {
  return isSpaceDucksVariant() ? spaceDucks : death1;
}

const _preselections = [
  getDefaultSet(),
  animals1,
  foodAndDrink1,
  sportActivityAndMusic1,
  clothingAndAccessories1,
  travelPlacesAndTransport1,
  red,
  flags,
];

const _preselectionsNames = [
  isSpaceDucksVariant() ? "Space Ducks" : "Death",
  "Animals",
  "Food & Drink",
  "Sport, Activity & Music",
  "Clothing & Accessories",
  "Travel, Places & Transport",
  "All red",
  "Flags",
];

export const preselections = _preselections.map((set, index) => ({
  id: splitEmojis(set)[0],
  name: _preselectionsNames[index],
  emojis: set,
}));
