import {
  bigAnimals,
  birdAnimals,
  clothing,
  death,
  domesticAnimals,
  freshFood,
  processedFood,
  sport,
  weatherAndEarth,
} from "../../../emojis/sets";
import { splitEmojis } from "../../../emojis/emoji-util";

const _preselections = [
  death,
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
