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

const MIN_GOAL = 3;
const MAX_GOAL = 13;

let configScreen, textarea, goalInput;

export function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  setConfigValue(getEmojiPool());
  goalInput.value = globals.level;
  document.body.appendChild(configScreen);
  textarea.focus();
}

function closeConfigScreen(loadNewLevel) {
  if (loadNewLevel) {
    const config = getConfigValue();
    const goal = Number(goalInput.value);
    setEmojiPool(config);
    setLevel(goal);
    window.location.reload();
    return;
  }
  document.body.removeChild(configScreen);
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
    text: "Goal per round:",
  });
  goalInput = createElement({ tag: "input" });
  goalInput.type = "number";
  goalInput.min = MIN_GOAL;
  goalInput.max = MAX_GOAL;
  goalInput.addEventListener("blur", validateGoal);
  goalContainer.appendChild(goalInput);
  configScreen.appendChild(goalContainer);
  const closeButton = createElement({
    tag: "button",
    cssClass: "btn",
    text: "Load game",
    onClick: closeConfigScreen,
  });
  configScreen.appendChild(closeButton);
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
