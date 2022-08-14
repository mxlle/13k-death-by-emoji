import { createElement } from "../utils/html-utils";
import { randomInt } from "../utils/random-utils";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../utils/local-storage";
import { globals } from "../globals";

const synth = window.speechSynthesis;
const utterThis = new SpeechSynthesisUtterance();
const randomOption = "random";

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

export function getVoiceListElement(voices, addRandom) {
  const voiceSelect = createElement({ tag: "select" });

  const savedVoice = getLocalStorageItem(LocalStorageKey.VOICE);

  if (addRandom) {
    let option = createElement({ tag: "option" });
    option.textContent = "Random";
    option.setAttribute("data-lang", randomOption);
    option.setAttribute("data-name", randomOption);
    if (savedVoice === "random") {
      option.setAttribute("selected", "selected");
    }
    voiceSelect.appendChild(option);
  }

  for (let i = 0; i < voices.length; i++) {
    let option = createElement({ tag: "option" });
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    if (savedVoice === voices[i].name) {
      option.setAttribute("selected", "selected");
    }
    voiceSelect.appendChild(option);
  }

  voiceSelect.addEventListener("change", (_event) => {
    const selectedVoice = getSelectedVoice(voiceSelect, voices, true);
    setLocalStorageItem(LocalStorageKey.LANG, selectedVoice.lang);
    setLocalStorageItem(LocalStorageKey.VOICE, selectedVoice.name);
  });

  return voiceSelect;
}

export function getSelectedVoice(voiceSelect, voices, forSaving) {
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");

  if (selectedOption === randomOption) {
    return forSaving
      ? { lang: randomOption, name: randomOption }
      : voices[randomInt(voices.length)];
  }

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      return voices[i];
    }
  }
}
