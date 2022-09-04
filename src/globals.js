import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "./utils/local-storage";
import { preselections } from "./components/config-tools/emoji-selection/preselections";
import { splitEmojis } from "./emojis/emoji-util";
import { shuffleArray } from "./utils/random-utils";

export const DEFAULT_LEVEL = 6;
export const MIN_GOAL = 3;
export const MAX_GOAL = 20;

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

export function setGameConfig(config) {
  if (!config) return;

  if (config.level > 0) {
    setLevel(config.level);
  }

  if (config.blindMode !== undefined) {
    globals.blindMode = config.blindMode;
    setLocalStorageItem(LocalStorageKey.BLIND, config.blindMode);
  }

  if (config.practiceMode !== undefined) {
    globals.practiceMode = config.practiceMode;
    setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, config.practiceMode);
  }
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

export function getRandomEmojisFromPool(length = 5) {
  const emojis = splitEmojis(getEmojiPool());
  return [emojis[0], ...shuffleArray(emojis.slice(1)).slice(0, length - 1)];
}
