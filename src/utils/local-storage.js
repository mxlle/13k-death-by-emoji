const LOCAL_STORAGE_PREFIX = "☠️👻🔫";

export const LocalStorageKey = {
  PRACTICE_MODE: "practiceMode",
  LANGUAGES: "selectedLanguages",
  VOICES: "selectedVoices",
  LEVEL: "currentLevel",
  EMOJI_POOL: "currentEmojiPool",
  EMOJI_POOL_NAME: "currentEmojiPoolName",
  BLIND: "blind",
  HIGH_SCORE: "highScore",
  HIGH_SCORE_COUNT: "highScoreCount",
  SPACE_DUCKS: "spaceDucks",
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
  const item = getLocalStorageItem(LocalStorageKey.LANGUAGES);
  if (!item) {
    return [];
  }

  return item.split(",");
}
