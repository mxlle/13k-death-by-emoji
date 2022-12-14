import { appendRainbowCapableText, createButton } from "../../utils/html-utils";

import { globals, isEndOfGame } from "../../globals";

import "./storyteller.scss";
import { updateHighScore } from "../score";
import { updateSecretSequenceComponent } from "../secret-sequence";
import {
  playInfiniteSequence,
  playPracticeSequence,
  newGame,
} from "../../game-logic";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

let storytellerButton;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  updateStorytellerButton();
});

export function createStorytellerButton() {
  storytellerButton = createButton({
    onClick: onPlayButtonClick,
  });
  storytellerButton.classList.add("play-btn");
  updateStorytellerButton();

  return storytellerButton;
}

async function onPlayButtonClick() {
  if (isEndOfGame()) {
    newGame();
    return;
  }

  storytellerButton.disabled = true;
  storytellerButton.classList.add("activated");

  const onNextEmoji = () => {
    updateSecretSequenceComponent();
  };

  globals.started = true;
  globals.isSpeaking = true;

  updateStorytellerButton();

  if (globals.practiceMode) {
    await playPracticeSequence(onNextEmoji);
  } else {
    await playInfiniteSequence(onNextEmoji);
    updateHighScore();
    pubSubService.publish(PubSubEvent.GAME_OVER);
  }

  globals.isSpeaking = false;

  updateSecretSequenceComponent();
  updateStorytellerButton();
  storytellerButton.classList.remove("activated");
  updateStorytellerButton();
}

export function updateStorytellerButton() {
  if (globals.isSpeaking) {
    storytellerButton.innerHTML = `🗣️ speaking...`;
  } else {
    if (isEndOfGame()) {
      storytellerButton.innerHTML = "Game over";
      storytellerButton.disabled = true;
    } else {
      storytellerButton.innerHTML = "";
      appendRainbowCapableText(
        storytellerButton,
        globals.started ? "🗣️ Replay" : "🗣️ Start"
      );
      storytellerButton.disabled = false;
    }
  }
}
