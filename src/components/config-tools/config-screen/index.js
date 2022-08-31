import "./config-screen.scss";

import { createElement } from "../../../utils/html-utils";
import { preselections } from "./preselections";
import {
  getEmojiPool,
  globals,
  setEmojiPool,
  setLevel,
} from "../../../globals";
import { removeDuplicates } from "../../../utils/array-utils";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";

const MIN_GOAL = 3;
const MAX_GOAL = 20;

let configScreen, dialog, textarea, goalInput;

export async function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  if (!dialog) dialog = createDialog(configScreen, "Start game");
  setConfigValue(getEmojiPool());
  goalInput.value = globals.level;
  textarea.focus();

  const submit = await dialog.open();
  if (submit) onConfigSubmitted();
}

function onConfigSubmitted() {
  const config = getConfigValue();
  const goal = Number(goalInput.value);
  setEmojiPool(config);
  setLevel(goal);
  window.location.reload();
}

function createConfigScreen() {
  configScreen = createElement({
    cssClass: "config",
    onClick: (event) => event.stopPropagation(),
  });
  const desc = createElement({
    cssClass: "config-desc",
    text: "Choose your next adventure or build your own",
  });
  configScreen.appendChild(desc);
  configScreen.appendChild(createAdventureButtons(preselections));
  textarea = createElement({ tag: "textarea" });
  textarea.addEventListener("input", validateConfig);
  configScreen.appendChild(textarea);
  const goalContainer = createElement({
    cssClass: "goal-input",
    text: "Variants per round:",
  });
  goalInput = createElement({ tag: "input" });
  goalInput.type = "number";
  goalInput.min = MIN_GOAL;
  goalInput.max = MAX_GOAL;
  goalInput.addEventListener("blur", validateGoal);
  goalContainer.appendChild(goalInput);
  configScreen.appendChild(goalContainer);
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
        validateGoal();
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
  textarea.focus();
}

function validateConfig() {
  setConfigValue(getConfigValue());
  validateGoal();
}

function validateGoal() {
  const goal = goalInput.value;
  const max = Math.min(MAX_GOAL, splitEmojis(getConfigValue()).length);
  if (goal < MIN_GOAL) {
    goalInput.value = MIN_GOAL;
  } else if (goal > max) {
    goalInput.value = max;
  }
}
