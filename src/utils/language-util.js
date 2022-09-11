import { removeDuplicates } from "./array-utils";

export function getLanguagesFromVoices(voices) {
  return removeDuplicates(
    voices
      .map((voice) => getShortLanguageName(voice.lang))
      .filter((lang) => lang)
  );
}

export function getShortLanguageName(lang) {
  return lang?.slice(0, 2);
}

export function getDefaultLanguage() {
  return getShortLanguageName(navigator.language);
}
