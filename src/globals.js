import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "./utils/local-storage";
import { death, spaceDucks } from "./emojis/sets";

export const DEFAULT_LEVEL = isSpaceDucksVariant() ? 12 : 4;

export const globals = {
  practiceMode: getLocalStorageItem(LocalStorageKey.PRACTICE_MODE),
  slots: 3,
  queue: [],
  started: false,
  endOfGame: false,
  currentIndex: 0,
  isSpeaking: false,
  correctCount: 0,
  mistakes: 0,
  clickCounter: 0,
  replayCounter: 0,
  streak: 1,
  languageFactor: 1,
  emojiSet: [],
  shuffledEmojis: [],
  correctMatches: [],
  blindMode: getLocalStorageItem(LocalStorageKey.BLIND),
  mute: getLocalStorageItem(LocalStorageKey.MUTE),
  level: getLevel(),
};

export function isGameActive() {
  return globals.started && !isEndOfGame();
}

export function isEndOfGame() {
  return globals.practiceMode
    ? globals.clickCounter >= globals.emojiSet.length
    : globals.endOfGame;
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

export function getEmojiPool() {
  return (
    getLocalStorageItem(LocalStorageKey.EMOJI_POOL) ||
    (isSpaceDucksVariant() ? spaceDucks : death)
  );
}

export function isSpaceDucksVariant() {
  return (
    getLocalStorageItem(LocalStorageKey.SPACE_DUCKS) ||
    window.location.host === "spaceducks.okj.ninja"
  );
}
