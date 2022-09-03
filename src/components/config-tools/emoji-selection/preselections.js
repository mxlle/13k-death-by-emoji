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

export const preselections = _preselections.map((set) => ({
  id: splitEmojis(set)[0],
  emojis: set,
}));
