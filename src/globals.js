import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "./utils/local-storage";

export const DEFAULT_LEVEL = 4;

export const globals = {
  clickCounter: 0,
  replayCounter: 0,
  streak: 1,
  emojiSet: [],
  shuffledEmojis: [],
  correctMatches: [],
  blindMode: getLocalStorageItem(LocalStorageKey.BLIND),
  mute: getLocalStorageItem(LocalStorageKey.MUTE),
  level: getLevel(),
};

export function isEndOfGame() {
  return globals.clickCounter >= globals.emojiSet.length;
}

export function setLevel(level) {
  globals.level = level;
  setLocalStorageItem(LocalStorageKey.LEVEL, level);
}

function getLevel() {
  const level = getLocalStorageItem(LocalStorageKey.LEVEL);
  return level ? Number(level) : DEFAULT_LEVEL;
}
