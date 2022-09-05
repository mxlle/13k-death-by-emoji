import {
  convertLongPressToClick,
  createElement,
  getPositionFromEvent,
} from "../../utils/html-utils";

import "./emoji-buttons.scss";
import { globals, isEndOfGame, isGameActive } from "../../globals";
import { updateScoreModifiers } from "../config-tools";
import { updateStorytellerButton } from "../storyteller";
import { speak } from "../../speech/speech";
import { getCurrentVoice } from "../config-tools/voice-config";
import { evaluatePlay } from "../../game-logic";
import { updateHighScore, updateScore } from "../score";
import { updateSecretSequenceComponent } from "../secret-sequence";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

const buttonMap = {};

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
    void speak(emoji, getCurrentVoice());
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

  updateScoreModifiers();
  updateStorytellerButton();
  updateSecretSequenceComponent();

  if (isEndOfGame()) {
    onEndOfGame();
  }
}

function createEmojiButton(emoji) {
  return createElement({
    tag: "button",
    text: emoji,
    cssClass: "emoji-button secondary-button",
  });
}

function showScoreAtButton(clickEvent, score) {
  const isPositive = score > 0;
  if (globals.practiceMode) {
    score = isPositive ? 1 : "❌";
  }
  const scoreElement = createElement({
    text: isPositive ? "+" + score : score,
    cssClass: "score-fly",
  });
  const { x, y } = getPositionFromEvent(clickEvent);
  scoreElement.style.setProperty("--init-top", Math.round(y) + "px");
  scoreElement.style.setProperty("--init-left", Math.round(x) + "px");
  scoreElement.classList.add(isPositive ? "positive" : "negative");
  document.body.appendChild(scoreElement);

  setTimeout(() => scoreElement.classList.add("transition-end"), 150);
  setTimeout(() => document.body.removeChild(scoreElement), 5000);
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
