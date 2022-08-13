import { createElement } from "../../utils/html-utils";
import {
  getAvailableVoices,
  getSelectedVoice,
  getVoiceListElement,
  speak,
} from "../../speech/speech";

import { globals, isEndOfGame } from "../../globals";

let voices, voiceListElement;
let storytellerButton;
let languageFilter = ["en", "de", "es", "fr"];

export function createStorytellerVoiceSelector() {
  return getAvailableVoices().then((_voices) => {
    voices = _voices;
    if (languageFilter.length) {
      voices = voices.filter((voice) =>
        languageFilter.includes(voice.lang.substring(0, 2))
      );
    }
    voiceListElement = getVoiceListElement(voices, true);
    return voiceListElement;
  });
}

export function createStorytellerButton() {
  storytellerButton = createElement({
    tag: "button",
    text: "📢",
    cssClass: "speak-button",
    onClick: () => speakEmojis(),
  });

  return storytellerButton;
}

async function speakEmojis() {
  if (isEndOfGame()) {
    window.location.reload();
    return;
  }

  const prevText = storytellerButton.innerHTML;
  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");
  for (const text of globals.shuffledEmojis) {
    if (!globals.blindMode) {
      storytellerButton.innerHTML = text;
    }

    await speakWithVoice(text);
  }
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  if (!isEndOfGame()) {
    storytellerButton.innerHTML = prevText;
  }
}

async function speakWithVoice(text) {
  const voice = voiceListElement && getSelectedVoice(voiceListElement, voices);
  await speak(text, voice);
}
