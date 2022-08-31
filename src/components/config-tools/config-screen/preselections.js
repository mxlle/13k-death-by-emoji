import {
  bigAnimals,
  clothing,
  death,
  domesticAnimals,
  flags,
  freshFood,
  processedFood,
  spaceDucks,
  sport,
  weatherAndEarth,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";
import { isSpaceDucksVariant } from "../../../globals";

const _preselections = [
  isSpaceDucksVariant() ? spaceDucks : death,
  bigAnimals,
  domesticAnimals,
  freshFood,
  processedFood,
  sport,
  clothing,
  weatherAndEarth,
  flags,
];

export const preselections = _preselections.map((set) => ({
  id: splitEmojis(set)[0],
  emojis: set,
}));
