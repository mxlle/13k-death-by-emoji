import { createElement } from "../../utils/html-utils";

import { globals, isEndOfGame } from "../../globals";

import "./storyteller.scss";
import { updateHighScore } from "../score";
import { updateSecretSequenceComponent } from "../secret-sequence";
import {
  playInfiniteSequence,
  playPracticeSequence,
  newGame,
} from "../../game-logic";

let storytellerButton;

export function createStorytellerButton() {
  storytellerButton = createElement({
    tag: "button",
    text: "🗣️ Start",
    cssClass: "storyteller-button",
    onClick: onPlayButtonClick,
  });

  return storytellerButton;
}

async function onPlayButtonClick() {
  if (isEndOfGame()) {
    newGame();
    return;
  }

  storytellerButton.setAttribute("disabled", "disabled");
  storytellerButton.classList.add("activated");

  const onNextEmoji = () => {
    if (!globals.blindMode) {
      updateSecretSequenceComponent();
    }
  };

  globals.started = true;
  globals.isSpeaking = true;

  updateStorytellerButtonText();

  if (globals.practiceMode) {
    await playPracticeSequence(onNextEmoji);
  } else {
    await playInfiniteSequence(onNextEmoji);
    updateHighScore();
  }

  globals.isSpeaking = false;

  updateSecretSequenceComponent();
  updateStorytellerButtonText();
  storytellerButton.classList.remove("activated");
  storytellerButton.removeAttribute("disabled");
  updateStorytellerButtonText();
}

export function updateStorytellerButtonText() {
  if (globals.isSpeaking) {
    storytellerButton.innerHTML = `🗣️ Transmitting...`;
  } else {
    if (isEndOfGame()) {
      storytellerButton.innerHTML = "Play again";
    } else {
      storytellerButton.innerHTML = `🗣️ Replay`;
    }
  }
}
