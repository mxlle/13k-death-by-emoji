import {
  appendRainbowCapableText,
  convertLongPressToClick,
  createElement,
  getPositionFromEvent,
} from "../../utils/html-utils";

import "./emoji-buttons.scss";
import { globals, isEndOfGame, isGameActive } from "../../globals";
import { updateStorytellerButton } from "../storyteller";
import { speak } from "../../speech/speech";
import { getCurrentVoice } from "../config-tools/voice-config";
import { evaluatePlay, getComboMultiplier } from "../../game-logic";
import { updateHighScore, updateScore } from "../score";
import { updateSecretSequenceComponent } from "../secret-sequence";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { splitEmojis } from "../../emojis/emoji-util";
import { party } from "../../emojis/sets";
import { getRandomItem } from "../../utils/array-utils";

const buttonMap = {};
const partyList = splitEmojis(party);

export function initEmojiButtonField(set) {
  const field = createElement({ cssClass: "emoji-field" });
  for (const emoji of set) {
    const button = createEmojiButton(emoji);
    button.addEventListener("mousedown", (event) => {
      onEmojiClick(emoji, button, event);
    });
    convertLongPressToClick(button, (event) => {
      onEmojiClick(emoji, button, event);
    });
    field.appendChild(button);
    buttonMap[emoji] = button;
  }

  return field;
}

function onEmojiClick(emoji, emojiButton, event) {
  if (!isGameActive()) {
    void speak(isEndOfGame() ? "Game over!" : emoji, getCurrentVoice());
    return;
  }

  const { correct, scoreForAction } = evaluatePlay(emoji);

  updateScore(scoreForAction);

  emojiButton.classList.add(correct ? "correct" : "wrong");
  showScoreAtButton(event, scoreForAction);
  setTimeout(() => {
    if (!isEndOfGame()) emojiButton.classList.remove("wrong");
    if (!globals.practiceMode) emojiButton.classList.remove("correct", "wrong");
  }, 500);

  updateStorytellerButton();
  updateSecretSequenceComponent();

  if (isEndOfGame()) {
    onEndOfGame();
  }
}

function createEmojiButton(emoji) {
  const button = createElement({
    tag: "button",
    cssClass: "emoji-btn",
  });
  appendRainbowCapableText(button, emoji);

  return button;
}

function showScoreAtButton(clickEvent, score) {
  const isPositive = score > 0;
  if (globals.practiceMode) {
    score = isPositive ? 1 : "❌";
  } else if (
    isPositive &&
    getComboMultiplier(globals.streak) > 1 &&
    getComboMultiplier(globals.streak) > getComboMultiplier(globals.streak - 1)
  ) {
    setTimeout(() => showComboAtButton(clickEvent), 150);
  }

  const scoreElement = createElement({
    text: isPositive ? "+" + score : score,
    cssClass: "score-fly",
  });
  scoreElement.classList.add(isPositive ? "positive" : "negative");
  const { x, y } = getPositionFromEvent(clickEvent);
  flyElementFrom(scoreElement, x, y);
}

function showComboAtButton(clickEvent) {
  const comboElement = createElement({
    text: `Combo ${getComboMultiplier(globals.streak)}x `,
    cssClass: "score-fly combo-fly",
  });
  comboElement.setAttribute("data-party", getRandomItem(partyList));
  const { x, y } = getPositionFromEvent(clickEvent);
  flyElementFrom(comboElement, x, y);
}

function flyElementFrom(element, x, y) {
  element.style.setProperty("--init-top", Math.round(y) + "px");
  element.style.setProperty("--init-left", Math.round(x) + "px");
  document.body.appendChild(element);

  setTimeout(() => element.classList.add("transition-end"), 150);
  setTimeout(() => document.body.removeChild(element), 5000);
}

function onEndOfGame() {
  if (globals.practiceMode) {
    for (let i = 0; i < globals.shuffledEmojis.length; i++) {
      if (!globals.correctMatches[i]) {
        buttonMap[globals.shuffledEmojis[i]].classList.add("wrong");
      }
    }
  }

  updateHighScore();
  pubSubService.publish(PubSubEvent.GAME_OVER);
}
