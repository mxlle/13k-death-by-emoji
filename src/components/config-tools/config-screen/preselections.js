import {
  bigAnimals,
  birdAnimals,
  clothing,
  death,
  domesticAnimals,
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
  birdAnimals,
  freshFood,
  processedFood,
  sport,
  clothing,
  weatherAndEarth,
];

export const preselections = _preselections.map((set) => ({
  id: splitEmojis(set)[0],
  emojis: set,
}));
