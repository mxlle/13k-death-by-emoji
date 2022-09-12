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
import {
  getLanguagesFromVoices,
  getLanguagesWithoutDefault,
} from "../../../utils/language-util";

let voices = [],
  languages = [],
  languageListElement = undefined,
  configScreen = undefined,
  dialog = undefined,
  selectionText = undefined,
  isNonDefaultMode = false,
  selectedLangs = getSelectedLanguagesFromStorage();

function retrieveVoices() {
  getAvailableVoices().then((_voices) => {
    if (!!languageListElement || !configScreen) return;
    voices = _voices;
    languages = getLanguagesFromVoices(voices);
    languageListElement = getLanguageListElement(languages, onChange);
    configScreen.appendChild(languageListElement);
  });
}

export function createVoiceSelector() {
  configScreen = createElement({
    cssClass: "voice-config",
    onClick: (event) => event.stopPropagation(),
  });

  retrieveVoices();

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

  retrieveVoices();

  globals.languageFactor = getSelectedLanguagesFromStorage()?.length || 1;

  return dialog;
}

export function openLanguageSelection(isSecondLanguageSelection = false) {
  if (!languageListElement) {
    speak("");
  }

  isNonDefaultMode = isSecondLanguageSelection;
  languageListElement?.classList.toggle(
    "no-default",
    isSecondLanguageSelection
  );
  onChange(getSelectedLanguagesFromStorage());

  return dialog.open().then((isConfirmed) => {
    if (isConfirmed) {
      onConfirm();
    }

    return isConfirmed;
  });
}

function onChange(selectedLanguages) {
  console.debug("selected languages changes", selectedLanguages);
  selectedLangs = selectedLanguages;
  selectionText.innerHTML = "Selection: " + getSelectionText();
  setSubmitDisabledState();
}

function getSelectionText() {
  return (
    (isNonDefaultMode
      ? getLanguagesWithoutDefault(selectedLangs)
      : selectedLangs
    ).join(", ") || "?"
  );
}

function setSubmitDisabledState() {
  dialog.toggleSubmitDisabled(
    isNonDefaultMode && getLanguagesWithoutDefault(selectedLangs).length <= 0
  );
}

function onConfirm() {
  globals.languageFactor = selectedLangs?.length || 1;
  setLocalStorageItem(LocalStorageKey.LANGUAGES, selectedLangs);
}

export function getLanguagesText() {
  return getSelectedLanguagesFromStorage().join(", ");
}
