import { createElement } from "../utils/html-utils";
import { randomInt } from "../utils/random-utils";
import {
  getLocalStorageItem,
  getSelectedLanguagesFromStorage,
  LocalStorageKey,
  setLocalStorageItem,
} from "../utils/local-storage";
import { globals } from "../globals";

const synth = window.speechSynthesis;
const utterThis = new SpeechSynthesisUtterance();

export function getAvailableVoices() {
  return new Promise((resolve) => {
    synth.onvoiceschanged = () => {
      resolve(synth.getVoices());
    };
  });
}

export function speak(text, voice) {
  utterThis.text = text;
  if (voice) {
    utterThis.voice = voice;
    utterThis.lang = voice.lang;
  }
  utterThis.volume = globals.mute ? 0 : 1;
  synth.speak(utterThis);

  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (!isSpeaking()) {
        clearInterval(id);
        resolve();
      }
    }, 100);
  });
}

export function isSpeaking() {
  return synth.speaking;
}

export function getVoiceListElement(voices) {
  const voiceSelect = createElement({ tag: "select" });
  voiceSelect.setAttribute("multiple", true);

  const savedVoices = getLocalStorageItem(LocalStorageKey.VOICES) ?? [];

  for (let i = 0; i < voices.length; i++) {
    let option = createElement({ tag: "option" });
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (!voices[i].localService) {
      option.textContent = "[online!] " + option.textContent;
    }

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    if (savedVoices.includes(voices[i].name)) {
      option.setAttribute("selected", "selected");
    }
    voiceSelect.appendChild(option);
  }

  voiceSelect.addEventListener("change", (_event) => {
    setLocalStorageItem(LocalStorageKey.VOICES, getSelectedVoices(voiceSelect));
    setLocalStorageItem(
      LocalStorageKey.LANGUAGES,
      getSelectedLanguages(voiceSelect)
    );
  });

  return voiceSelect;
}

export function getSelectedVoice(voiceSelect, voices) {
  const selectedOptions = getSelectedVoices(voiceSelect);
  let selectedOption = selectedOptions[randomInt(selectedOptions.length)];

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      return voices[i];
    }
  }
}

function getSelectedVoices(voiceSelect) {
  return Array.from(voiceSelect.selectedOptions).map((option) =>
    option.getAttribute("data-name")
  );
}

export function getSelectedLanguages(voiceSelect) {
  if (!voiceSelect) {
    return getSelectedLanguagesFromStorage();
  }

  const languages = Array.from(voiceSelect.selectedOptions).map((option) => {
    const lang = option.getAttribute("data-lang");

    return lang && lang.length > 2 ? lang.substring(0, 2) : lang;
  });
  return languages.filter((lang, index) => {
    return languages.indexOf(lang) === index;
  });
}
