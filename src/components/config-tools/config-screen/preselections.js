import {
  allObjects,
  animals,
  clothingAndAccessories,
  death,
  flags,
  foodAndDrink,
  nature,
  spaceDucks,
  sportActivityAndMusic,
  travelAndPlaces,
  vehicles,
  weatherAndEarth,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";
import { isSpaceDucksVariant } from "../../../globals";

const _preselections = [
  isSpaceDucksVariant() ? spaceDucks : death,
  animals,
  foodAndDrink,
  sportActivityAndMusic,
  clothingAndAccessories,
  nature + weatherAndEarth,
  vehicles + travelAndPlaces,
  allObjects,
  flags,
];

export const preselections = _preselections.map((set) => ({
  id: splitEmojis(set)[0],
  emojis: set,
}));
