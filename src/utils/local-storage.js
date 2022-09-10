const LOCAL_STORAGE_PREFIX = "☠️👻🔫";

export const LocalStorageKey = {
  PRACTICE_MODE: "practice",
  LANGUAGES: "langs",
  VOICES: "voices",
  LEVEL: "level",
  EMOJI_POOL: "emojis",
  EMOJI_POOL_NAME: "emojiName",
  BLIND: "blind",
  HIGH_SCORE: "highScore",
  HIGH_SCORE_COUNT: "highScoreCount",
  CURRENT_GAME: "gameId",
  COMPLETED_GAMES: "completed",
  SPACE_DUCKS: "sd",
  RAINBOW_MODE: "rainbow",
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
  return getArrayFromStorage(LocalStorageKey.LANGUAGES);
}

export function getArrayFromStorage(key) {
  const item = getLocalStorageItem(key);
  if (!item) {
    return [];
  }

  return item.split(",");
}

export function isSpaceDucksVariant() {
  return (
    getLocalStorageItem(LocalStorageKey.SPACE_DUCKS) ||
    window.location.host === "spaceducks.okj.ninja"
  );
}
