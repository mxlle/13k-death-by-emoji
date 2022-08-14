import {
  getAvailableVoices,
  getSelectedLanguages,
  getSelectedVoice,
  getVoiceListElement,
  speak,
} from "../../../speech/speech";
import { createElement } from "../../../utils/html-utils";

import "./voice-config.scss";
import { globals } from "../../../globals";

let voices = [],
  voiceListElement = undefined,
  hostElement = undefined,
  configScreen = undefined,
  selectionText = undefined,
  onChangeCallback = () => {},
  isVisible = false;

export function createVoiceSelector() {
  getAvailableVoices().then((_voices) => {
    voices = _voices;
    voiceListElement = getVoiceListElement(voices, onChange);
    voiceListElement.setAttribute("size", voices.length + 1);
    configScreen.appendChild(voiceListElement);
  });

  hostElement = createElement({
    cssClass: "backdrop",
    onClick: () => toggleConfig(),
  });
  hostElement.style.display = "none";

  configScreen = createElement({
    cssClass: "voice-config",
    onClick: (event) => event.stopPropagation(),
  });
  hostElement.appendChild(configScreen);

  selectionText = createElement({
    cssClass: "selection",
    text: "Selection: " + getLanguagesText(),
  });
  configScreen.appendChild(selectionText);

  configScreen.appendChild(
    createElement({
      tag: "button",
      text: "OK",
      cssClass: "ok-button",
      onClick: () => toggleConfig(),
    })
  );

  const info = createElement({
    cssClass: "info",
    text: "Info: activate random mode by selecting multiple values",
  });
  configScreen.appendChild(info);

  globals.languageFactor = getSelectedLanguages(voiceListElement)?.length || 1;

  return hostElement;
}

export function toggleConfig(onChange) {
  if (onChange) {
    onChangeCallback = onChange;
  }
  if (!voiceListElement) {
    speak("");
  }
  isVisible = !isVisible;
  hostElement.style.display = isVisible ? "inherit" : "none";
}

function onChange() {
  globals.languageFactor = getSelectedLanguages(voiceListElement)?.length || 1;
  selectionText.innerHTML = "Selection: " + getLanguagesText();
  onChangeCallback();
}

export function getCurrentVoice() {
  return voiceListElement && getSelectedVoice(voiceListElement, voices);
}

export function getLanguagesText() {
  return getSelectedLanguages(voiceListElement).join(", ");
}
