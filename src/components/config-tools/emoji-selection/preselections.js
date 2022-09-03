import {
  animals1,
  clothingAndAccessories1,
  death1,
  flags,
  foodAndDrink1,
  miscObjects1,
  nature1,
  spaceDucks,
  sportActivityAndMusic1,
  travelPlacesAndTransport1,
  weather1,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";
import { isSpaceDucksVariant } from "../../../globals";

const _preselections = [
  isSpaceDucksVariant() ? spaceDucks : death1,
  animals1,
  foodAndDrink1,
  sportActivityAndMusic1,
  clothingAndAccessories1,
  nature1 + weather1,
  travelPlacesAndTransport1,
  miscObjects1,
  flags,
];

const _preselectionsNames = [
  isSpaceDucksVariant() ? "Space Ducks" : "Death",
  "Animals",
  "Food & Drink",
  "Sport, Activity & Music",
  "Clothing & Accessories",
  "Nature & Weather",
  "Travel, Places & Transport",
  "Misc. Objects",
  "Flags",
];

export const preselections = _preselections.map((set, index) => ({
  id: splitEmojis(set)[0],
  name: _preselectionsNames[index],
  emojis: set,
}));
