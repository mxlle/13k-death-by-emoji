import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "./utils/local-storage";
import { death } from "./emojis/sets";

export const DEFAULT_LEVEL = 4;

export const globals = {
  clickCounter: 0,
  replayCounter: 0,
  streak: 1,
  languageFactor: 1,
  emojiPool: getEmojiPool(),
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

export function setEmojiPool(emojis) {
  setLocalStorageItem(LocalStorageKey.EMOJI_POOL, emojis);
}

function getEmojiPool() {
  return getLocalStorageItem(LocalStorageKey.EMOJI_POOL) || death;
}
