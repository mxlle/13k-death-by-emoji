import {
  getAvailableVoices,
  getLanguageListElement,
  speak,
} from "../../../speech/speech";
import { createElement } from "../../../utils/html-utils";

import "./voice-config.scss";
import { globals } from "../../../globals";
import {
  getSelectedLanguagesFromStorage,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";
import { createDialog } from "../../dialog";
import { getLanguagesFromVoices } from "../../../utils/language-util";

let voices = [],
  languages = [],
  languageListElement = undefined,
  configScreen = undefined,
  dialog = undefined,
  selectionText = undefined,
  selectedLangs = [];

export function createVoiceSelector() {
  getAvailableVoices().then((_voices) => {
    voices = _voices;
    languages = getLanguagesFromVoices(voices);
    languageListElement = getLanguageListElement(languages, onChange);
    configScreen.appendChild(languageListElement);
  });

  configScreen = createElement({
    cssClass: "voice-config",
    onClick: (event) => event.stopPropagation(),
  });

  selectionText = createElement({
    cssClass: "selection",
    text: "Selection: " + getLanguagesText(),
  });
  configScreen.appendChild(selectionText);

  const info = createElement({
    cssClass: "info",
    text: "Info: activate random mode by selecting multiple values",
  });
  configScreen.appendChild(info);

  dialog = createDialog(configScreen, "OK", "Language selection");

  globals.languageFactor = getSelectedLanguagesFromStorage()?.length || 1;

  return dialog;
}

export function openLanguageSelection(onChange) {
  if (!languageListElement) {
    speak("");
  }

  return dialog.open().then((isConfirmed) => {
    if (isConfirmed) {
      onConfirm();
      onChange();
    }
  });
}

function onChange(selectedLanguages) {
  console.debug("selected languages changes", selectedLanguages);
  selectedLangs = selectedLanguages;
  selectionText.innerHTML = "Selection: " + selectedLanguages.join(", ");
}

function onConfirm() {
  globals.languageFactor = selectedLangs?.length || 1;
  setLocalStorageItem(LocalStorageKey.LANGUAGES, selectedLangs);
}

export function getLanguagesText() {
  return getSelectedLanguagesFromStorage().join(", ");
}
