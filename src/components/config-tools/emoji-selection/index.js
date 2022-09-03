import "./emoji-selection.scss";

import { createElement } from "../../../utils/html-utils";
import { preselections } from "./preselections";
import { getEmojiPool, setEmojiPool } from "../../../globals";
import { removeDuplicates } from "../../../utils/array-utils";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";

let emojiSelectionButton, emojiSelectionScreen, dialog, textarea;

export function createEmojiSelectionButton(afterSelectionCallback) {
  emojiSelectionButton = createElement({
    tag: "button",
    cssClass: "emoji-selection-btn icon-button",
    onClick: async () => {
      await showEmojiSelectionScreen();
      if (afterSelectionCallback) afterSelectionCallback();
    },
  });
  updateEmojiSelectionButtonText();

  return emojiSelectionButton;
}

function updateEmojiSelectionButtonText() {
  emojiSelectionButton.innerText = "";
  const emojiContainer = createElement({ cssClass: "emoji-container" });
  splitEmojis(getEmojiPool())
    .slice(0, 3)
    .forEach((emoji) =>
      emojiContainer.appendChild(createElement({ text: emoji }))
    );
  emojiSelectionButton.appendChild(emojiContainer);
  emojiSelectionButton.appendChild(createElement({ text: "Click to change" }));
}

async function showEmojiSelectionScreen() {
  if (!emojiSelectionScreen) createEmojiSelectionScreen();
  if (!dialog) dialog = createDialog(emojiSelectionScreen, "OK");
  setConfigValue(getEmojiPool());

  const submit = await dialog.open();
  if (submit) onConfigSubmitted();
}

function onConfigSubmitted() {
  const config = getConfigValue();
  setEmojiPool(config);
  updateEmojiSelectionButtonText();
}

function createEmojiSelectionScreen() {
  emojiSelectionScreen = createElement({
    cssClass: "emoji-selection",
    onClick: (event) => event.stopPropagation(),
  });
  const desc = createElement({
    cssClass: "config-desc",
    text: "Choose a set of emojis or define your own",
  });
  emojiSelectionScreen.appendChild(desc);
  emojiSelectionScreen.appendChild(createAdventureButtons(preselections));
  textarea = createElement({ tag: "textarea" });
  textarea.addEventListener("input", validateConfig);
  emojiSelectionScreen.appendChild(textarea);
}

function createAdventureButtons(adventures) {
  const buttonsContainer = createElement({ cssClass: "button-container" });
  adventures.forEach(({ id, emojis }) => {
    const btn = createElement({
      tag: "button",
      cssClass: "adventure-btn",
      text: id,
      onClick: () => {
        setConfigValue(emojis);
      },
    });
    buttonsContainer.appendChild(btn);
  });
  return buttonsContainer;
}

function getConfigValue() {
  return textarea.value;
}

function setConfigValue(value) {
  textarea.value = removeDuplicates(splitEmojis(value)).join("");
}

function validateConfig() {
  setConfigValue(getConfigValue());
}
