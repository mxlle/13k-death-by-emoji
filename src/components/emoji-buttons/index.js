import { createElement } from "../../utils/html-utils";

import "./emoji-buttons.scss";
import { globals, isEndOfGame, isGameActive } from "../../globals";
import { ScoreAction, updateScore } from "../score";
import { updateScoreModifiers } from "../config-tools";
import { updateStorytellerButtonText } from "../storyteller";
import { speak } from "../../speech/speech";
import { getCurrentVoice } from "../config-tools/voice-config";

export const buttonMap = {};

export function initEmojiButtonField(set, onClick) {
  const field = createElement({ cssClass: "emoji-field" });
  for (const emoji of set) {
    const button = createEmojiButton(emoji);
    button.addEventListener("click", (event) =>
      onEmojiClick(emoji, button, onClick, event)
    );
    field.appendChild(button);
    buttonMap[emoji] = button;
  }

  return field;
}

function onEmojiClick(emoji, emojiButton, onClick, event) {
  if (!isGameActive()) {
    void speak(emoji, getCurrentVoice());
    return;
  }

  const correct = getWantedEmoji() === emoji;

  if (correct) {
    globals.correctCount++;
  } else {
    globals.slots--;
    globals.mistakes++;
  }

  emojiButton.classList.add(correct ? "correct" : "wrong");
  const scoreForAction = updateScore(
    correct ? ScoreAction.CORRECT : ScoreAction.WRONG
  );
  showScoreAtButton(event, scoreForAction);
  setTimeout(() => {
    if (!isEndOfGame()) emojiButton.classList.remove("wrong");
    if (!globals.practiceMode) emojiButton.classList.remove("correct", "wrong");
  }, 500);
  if (globals.practiceMode) {
    globals.correctMatches[globals.clickCounter] = correct;
    globals.clickCounter++;
  }
  globals.streak = correct ? globals.streak + 1 : 1;
  updateScoreModifiers();
  updateStorytellerButtonText();

  onClick();
}

function getWantedEmoji() {
  return globals.practiceMode
    ? globals.shuffledEmojis[globals.clickCounter]
    : globals.queue.shift();
}

function createEmojiButton(emoji) {
  return createElement({
    tag: "button",
    text: emoji,
    cssClass: "emoji-button emoji",
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
  scoreElement.style.setProperty("--init-top", clickEvent.y + "px");
  scoreElement.style.setProperty("--init-left", clickEvent.x + "px");
  document.body.appendChild(scoreElement);
  setTimeout(
    () => scoreElement.classList.add(isPositive ? "positive" : "negative"),
    0
  );
  setTimeout(() => document.body.removeChild(scoreElement), 5000);
}
