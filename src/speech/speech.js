import { createElement } from "../utils/html-utils";
import { randomInt } from "../utils/random-utils";
import {
  getLocalStorageItem,
  getSelectedLanguagesFromStorage,
  LocalStorageKey,
  setLocalStorageItem,
} from "../utils/local-storage";

const synth = window.speechSynthesis;
const utterMap = {};

export function getAvailableVoices() {
  return new Promise((resolve) => {
    synth.onvoiceschanged = () => {
      resolve(synth.getVoices());
    };
  });
}

export function speak(text, voice, rate) {
  let utterThis = initVoice(voice);

  utterThis.text = text;
  utterThis.rate = rate ?? 1;
  utterThis.pitch = Math.sqrt(utterThis.rate);
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

function initVoices(voices) {
  for (let voice of voices) {
    initVoice(voice);
  }
}

function initVoice(voice) {
  let utterThis = utterMap[voice?.name];
  if (!utterThis) {
    utterThis = new SpeechSynthesisUtterance();
    utterThis.voice = voice;
    utterThis.lang = voice?.lang;
    utterMap[voice?.name] = utterThis;
  }
  return utterThis;
}

export function isSpeaking() {
  return synth.speaking;
}

export function getVoiceListElement(voices, onChange) {
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
    initVoices(getAllSelectedVoices(voiceSelect, voices));
    onChange && onChange();
  });

  initVoices(getAllSelectedVoices(voiceSelect, voices));

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

function getAllSelectedVoices(voiceSelect, voices) {
  const selectedOptions = getSelectedVoices(voiceSelect);
  const selectedVoices = [];

  for (let i = 0; i < voices.length; i++) {
    if (selectedOptions.includes(voices[i].name)) {
      selectedVoices.push(voices[i]);
    }
  }

  return selectedVoices;
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
