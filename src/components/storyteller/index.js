import { createElement } from "../../utils/html-utils";
import {
  getAvailableVoices,
  getSelectedVoice,
  getVoiceListElement,
  isSpeaking,
  speak,
} from "../../speech/speech";

import { globals, isEndOfGame } from "../../globals";

import "./storyteller.scss";
import { getPointsByAction, ScoreAction, updateScore } from "../score";
import { updateScoreModifiers } from "../config-tools";

let voices, voiceListElement;
let storytellerButton;
let languageFilter = ["en", "de"]; // ["en", "de", "es", "fr"];
let readOnce = false;

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
    cssClass: "storyteller-button",
    onClick: () => speakEmojis(),
  });

  return storytellerButton;
}

async function speakEmojis() {
  if (isEndOfGame()) {
    window.location.reload();
    return;
  }

  if (readOnce) {
    updateScore(ScoreAction.REPLAY);
    globals.streak = 1;
    updateScoreModifiers();
  }

  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");
  for (let i = globals.clickCounter; i < globals.shuffledEmojis.length; i++) {
    const text = globals.shuffledEmojis[i];

    if (!globals.blindMode) {
      storytellerButton.innerHTML = text;
    }

    await speakWithVoice(text);
  }
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  readOnce = true;
  updateReplayFine();
}

export function updateReplayFine() {
  if (!isEndOfGame() && !isSpeaking()) {
    const replayFine = getPointsByAction(ScoreAction.REPLAY);
    if (replayFine) storytellerButton.innerHTML = `📢 ${replayFine}`;
  }
}

async function speakWithVoice(text) {
  const voice = voiceListElement && getSelectedVoice(voiceListElement, voices);
  await speak(text, voice);
}
