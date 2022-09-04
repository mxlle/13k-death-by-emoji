import "./emoji-selection.scss";

import { createElement } from "../../../utils/html-utils";
import { preselections } from "./preselections";
import {
  getEmojiPool,
  getRandomEmojisFromPool,
  setEmojiPool,
} from "../../../globals";
import { removeDuplicates } from "../../../utils/array-utils";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";

const EMOJI_POOL_CUSTOM_NAME = "Custom";

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
  getRandomEmojisFromPool().forEach((emoji) =>
    emojiContainer.appendChild(createElement({ text: emoji }))
  );
  emojiSelectionButton.appendChild(emojiContainer);
  emojiSelectionButton.appendChild(
    createElement({
      text:
        getLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME) ||
        EMOJI_POOL_CUSTOM_NAME,
    })
  );
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
  adventures.forEach(({ id, name, emojis }) => {
    const btn = createElement({
      tag: "button",
      cssClass: "adventure-btn secondary-button",
      text: id,
      onClick: () => {
        setConfigValue(emojis);
        setLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME, name);
      },
    });
    btn.title = name;
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
  setLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME, EMOJI_POOL_CUSTOM_NAME);
}
