import { createElement } from "../../utils/html-utils";

import "./emoji-buttons.scss";
import { globals, isEndOfGame } from "../../globals";
import { ScoreAction, updateScore } from "../score";
import { updateScoreModifiers } from "../config-tools";

export const buttonMap = {};

export function initEmojiButtonField(set, onClick) {
  const field = createElement({ cssClass: "emoji-field" });
  for (const emoji of set) {
    const button = createEmojiButton(emoji);
    button.addEventListener("click", () =>
      onEmojiClick(emoji, button, onClick)
    );
    field.appendChild(button);
    buttonMap[emoji] = button;
  }

  return field;
}

function onEmojiClick(emoji, emojiButton, onClick) {
  const correct = globals.shuffledEmojis[globals.clickCounter] === emoji;
  emojiButton.classList.add(correct ? "correct" : "wrong");
  updateScore(correct ? ScoreAction.CORRECT : ScoreAction.WRONG);
  setTimeout(() => {
    if (!isEndOfGame()) emojiButton.classList.remove("wrong");
  }, 500);
  globals.correctMatches[globals.clickCounter] = correct;
  globals.clickCounter++;
  globals.streak = correct ? globals.streak + 1 : 1;
  updateScoreModifiers();

  onClick();
}

function createEmojiButton(emoji) {
  return createElement({
    tag: "button",
    text: emoji,
    cssClass: "emoji-button",
  });
}
