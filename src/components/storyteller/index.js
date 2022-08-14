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
import { updateSecretSequenceComponent } from "../secret-sequence";

let voices, voiceListElement;
let storytellerButton;
let languageFilter = ["en", "de"]; // ["en", "de", "es", "fr"];

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

  if (globals.replayCounter > 0) {
    updateScore(ScoreAction.REPLAY);
    globals.streak = 1;
    updateScoreModifiers();
    updateStorytellerButtonText();
  }

  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");
  for (let i = globals.clickCounter; i < globals.shuffledEmojis.length; i++) {
    const text = globals.shuffledEmojis[i];

    if (!globals.blindMode) {
      updateSecretSequenceComponent(i);
    }

    await speakWithVoice(text);

    updateSecretSequenceComponent();
  }
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  globals.replayCounter++;
  updateStorytellerButtonText();
}

export function updateStorytellerButtonText() {
  if (!isEndOfGame() && !isSpeaking()) {
    const replayFine = getPointsByAction(ScoreAction.REPLAY);
    if (replayFine) {
      storytellerButton.innerHTML = `📢 ${replayFine}`;
    }
  } else if (!isEndOfGame()) {
    storytellerButton.innerHTML = `📢`;
  }
}

async function speakWithVoice(text) {
  const voice = voiceListElement && getSelectedVoice(voiceListElement, voices);
  await speak(text, voice);
}
