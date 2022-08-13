import { createElement } from "../../utils/html-utils";

import "./emoji-buttons.scss";
import { globals } from "../../globals";
import { ScoreAction, updateScore } from "../score";

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
    emojiButton.classList.remove("wrong");
  }, 500);
  globals.correctMatches[globals.clickCounter] = correct;
  globals.clickCounter++;
  onClick();
}

function createEmojiButton(emoji) {
  return createElement({
    tag: "button",
    text: emoji,
    cssClass: "emoji-button",
  });
}
