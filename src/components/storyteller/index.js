import { createElement } from "../../utils/html-utils";
import { speak } from "../../speech/speech";

import { globals, isEndOfGame } from "../../globals";

import "./storyteller.scss";
import { updateHighScore } from "../score";
import { updateScoreModifiers } from "../config-tools";
import { updateSecretSequenceComponent } from "../secret-sequence";
import { getCurrentVoice } from "../config-tools/voice-config";
import { getRandomItem } from "../../utils/array-utils";

let storytellerButton;

export function createStorytellerButton() {
  storytellerButton = createElement({
    tag: "button",
    text: "📢 Start",
    cssClass: "storyteller-button",
    onClick: () =>
      globals.practiceMode ? speakEmojisPractice() : speakEmojisInfinite(),
  });

  return storytellerButton;
}

async function speakEmojisPractice() {
  if (isEndOfGame()) {
    window.location.reload();
    return;
  }

  globals.started = true;

  if (globals.replayCounter > 0) {
    globals.streak = 1;
    updateScoreModifiers();
    updateStorytellerButtonText();
  }

  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");
  globals.isSpeaking = true;
  for (let i = globals.clickCounter; i < globals.shuffledEmojis.length; i++) {
    const text = globals.shuffledEmojis[i];
    globals.currentIndex = i;

    if (!globals.blindMode) {
      updateSecretSequenceComponent();
    }

    await speakWithVoice(text);
  }
  globals.isSpeaking = false;
  updateSecretSequenceComponent();
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  globals.replayCounter++;
  updateStorytellerButtonText();
}

async function speakEmojisInfinite() {
  if (isEndOfGame()) {
    window.location.reload();
    return;
  }

  globals.started = true;

  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");
  globals.isSpeaking = true;
  while (globals.queue.length < globals.slots) {
    const text = getRandomItem(globals.emojiSet);
    globals.queue.push(text);

    if (!globals.blindMode) {
      updateSecretSequenceComponent();
    }

    await speakWithVoice(text);
  }
  globals.isSpeaking = false;
  globals.endOfGame = true;
  updateHighScore();
  updateSecretSequenceComponent();
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  updateStorytellerButtonText();
}

export function updateStorytellerButtonText() {
  if (isEndOfGame()) {
    storytellerButton.innerHTML = "Play again";
  } else {
    storytellerButton.innerHTML = `📢 Replay`;
  }
}

async function speakWithVoice(text) {
  const voice = getCurrentVoice();
  await speak(text, voice);
}
