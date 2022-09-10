import "./emoji-selection.scss";

import { createButton, createElement } from "../../../utils/html-utils";
import { preselections } from "./preselections";
import {
  EMOJI_POOL_CUSTOM_NAME,
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

let emojiSelectionButton, emojiSelectionScreen, dialog, textarea;
let selectedName;

export function createEmojiSelectionButton(afterSelectionCallback) {
  emojiSelectionButton = createButton({
    iconBtn: true,
    onClick: async () => {
      await showEmojiSelectionScreen();
      if (afterSelectionCallback) afterSelectionCallback();
    },
  });
  emojiSelectionButton.classList.add("emoji-selection-btn");
  updateEmojiSelectionButtonText();

  return emojiSelectionButton;
}

export function updateEmojiSelectionButtonText() {
  emojiSelectionButton.innerText = "";
  const emojiContainer = createElement({ cssClass: "emoji-container rbc" });
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
  if (selectedName) {
    setLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME, selectedName);
  }
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
  const buttonsContainer = createElement({ cssClass: "btn-container" });
  adventures.forEach(({ id, name, emojis }) => {
    const btn = createButton({
      text: id,
      onClick: () => {
        setConfigValue(emojis);
        selectedName = name;
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
