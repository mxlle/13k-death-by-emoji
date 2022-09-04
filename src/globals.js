import {
  getLocalStorageItem,
  isSpaceDucksVariant,
  LocalStorageKey,
  setLocalStorageItem,
} from "./utils/local-storage";
import { preselections } from "./components/config-tools/emoji-selection/preselections";

export const DEFAULT_LEVEL = isSpaceDucksVariant() ? 12 : 6;

const defaultGlobals = {
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
  streak: 1,
  languageFactor: 1,
  emojiSet: [],
  shuffledEmojis: [],
  correctMatches: [],
  blindMode: getLocalStorageItem(LocalStorageKey.BLIND),
  level: getLevel(),
};

export const globals = {
  ...defaultGlobals,
};

export function resetGlobals() {
  Object.assign(globals, defaultGlobals);
  globals.practiceMode = getLocalStorageItem(LocalStorageKey.PRACTICE_MODE);
  globals.blindMode = getLocalStorageItem(LocalStorageKey.BLIND);
  globals.level = getLevel();
  globals.queue = [];
}

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
  let emojiPool = getLocalStorageItem(LocalStorageKey.EMOJI_POOL);
  if (!emojiPool) {
    emojiPool = preselections[0].emojis;
    setLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME, preselections[0].name);
  }

  return emojiPool;
}
