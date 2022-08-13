import { createElement } from "../../utils/html-utils";

import "./emoji-buttons.scss";

export const buttonMap = {};

export function initEmojiButtonField(set, onClick) {
  const field = createElement({ cssClass: "emoji-field" });
  for (const emoji of set) {
    const button = createEmojiButton(emoji);
    button.addEventListener("click", () => onClick(emoji, button));
    field.appendChild(button);
    buttonMap[emoji] = button;
  }

  return field;
}

function createEmojiButton(emoji) {
  return createElement({
    tag: "button",
    text: emoji,
    cssClass: "emoji-button",
  });
}
