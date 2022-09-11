import { getDefaultLanguage } from "./language-util";

const LOCAL_STORAGE_PREFIX = "☠️👻🔫";

export const LocalStorageKey = {
  PRACTICE_MODE: "practice",
  LANGUAGES: "langs",
  LEVEL: "level",
  EMOJI_POOL: "emojis",
  EMOJI_POOL_NAME: "emojiName",
  BLIND: "blind",
  HIGH_SCORE: "highScore",
  HIGH_SCORE_COUNT: "highScoreCount",
  CURRENT_GAME: "gameId",
  SPACE_DUCKS: "sd",
  RAINBOW_MODE: "rainbow",
  GAME_HIGH_COUNT: "hc",
};

export function setLocalStorageItem(key, value) {
  if (value === false) {
    removeLocalStorageItem(key);
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_PREFIX + "." + key, value);
}

export function getLocalStorageItem(key) {
  return localStorage.getItem(LOCAL_STORAGE_PREFIX + "." + key);
}

export function removeLocalStorageItem(key) {
  localStorage.removeItem(LOCAL_STORAGE_PREFIX + "." + key);
}

export function getSelectedLanguagesFromStorage() {
  const languages = getArrayFromStorage(LocalStorageKey.LANGUAGES);
  if (languages.length === 0) {
    return [getDefaultLanguage()];
  }
  return languages;
}

export function getArrayFromStorage(key) {
  const item = getLocalStorageItem(key);
  if (!item) {
    return [];
  }

  return item.split(",");
}

export function getGameHighCount(id) {
  return parseInt(
    getLocalStorageItem(LocalStorageKey.GAME_HIGH_COUNT + "." + id) ?? 0
  );
}

export function setGameHighCount(id, count) {
  const previousCount = getGameHighCount(id);
  if (!previousCount || previousCount < count) {
    setLocalStorageItem(LocalStorageKey.GAME_HIGH_COUNT + "." + id, count);
  }
}

export function isSpaceDucksVariant() {
  return (
    getLocalStorageItem(LocalStorageKey.SPACE_DUCKS) ||
    window.location.host === "spaceducks.okj.ninja"
  );
}
