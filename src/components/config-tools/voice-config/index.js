import {
  getAvailableVoices,
  getSelectedLanguages,
  getSelectedVoice,
  getVoiceListElement,
  speak,
} from "../../../speech/speech";
import { createElement } from "../../../utils/html-utils";

import "./voice-config.scss";
import {
  getLocalStorageItem,
  LocalStorageKey,
} from "../../../utils/local-storage";

let voices = [],
  voiceListElement = undefined,
  configScreen = undefined,
  isVisible = false;

export function createVoiceSelector() {
  getAvailableVoices().then((_voices) => {
    voices = _voices;
    voiceListElement = getVoiceListElement(voices, true);
    voiceListElement.setAttribute("size", voices.length + 1);
    configScreen.appendChild(voiceListElement);
  });

  configScreen = createElement({ cssClass: "voice-config" });
  configScreen.style.display = "none";

  const label = createElement({
    cssClass: "label",
    text: "Info: activate random mode by selecting multiple values",
  });
  configScreen.appendChild(label);

  return configScreen;
}

export function toggleConfig() {
  if (!voiceListElement) {
    speak("");
  }
  isVisible = !isVisible;
  configScreen.style.display = isVisible ? "block" : "none";
}

export function getCurrentVoice() {
  return voiceListElement && getSelectedVoice(voiceListElement, voices);
}

export function getLanguagesText() {
  if (!voiceListElement) return getLocalStorageItem(LocalStorageKey.LANGUAGES);

  return getSelectedLanguages(voiceListElement).join(", ");
}
