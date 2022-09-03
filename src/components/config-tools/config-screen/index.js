import "./config-screen.scss";

import { createElement } from "../../../utils/html-utils";
import { getEmojiPool, globals, isEndOfGame, setLevel } from "../../../globals";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";
import { getPointsByAction, newGame, ScoreAction } from "../../../game-logic";
import {
  createEmojiSelectionButton,
  showEmojiSelectionScreen,
} from "../emoji-selection";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";
import { getLanguagesText, toggleConfig } from "../voice-config";
import { createModeSwitcher } from "../../mode-switcher";

const MIN_GOAL = 3;
const MAX_GOAL = 20;

let configScreen, dialog, goalInput;
let muteButton, blindButton, languageButton, scoreModifiers;

export async function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  if (!dialog)
    dialog = createDialog(configScreen, "Load game", "Configuration");
  goalInput.value = globals.level;

  updateAll();

  const submit = await dialog.open();
  if (submit) onConfigSubmitted();
}

function onConfigSubmitted() {
  const goal = getGoalInputValue();
  setLevel(goal);
  newGame();
}

function updateAll() {
  updateScoreModifiers();
  updateBlindButtonText();
  updateMuteButtonText();
  updateLanguageButtonText();
}

function createConfigScreen() {
  configScreen = createElement({
    cssClass: "config",
    onClick: (event) => event.stopPropagation(),
  });
  configScreen.appendChild(createEmojiSelectionButton(() => validateGoal()));
  muteButton = createElement({
    tag: "button",
    cssClass: "mute-button icon-button",
    onClick: () => {
      globals.mute = !globals.mute;
      setLocalStorageItem(LocalStorageKey.MUTE, !!globals.mute);
      updateMuteButtonText();
      updateScoreModifiers();
      if (globals.mute && globals.blindMode) {
        blindButton.click();
      }
    },
  });
  updateMuteButtonText();

  blindButton = createElement({
    tag: "button",
    cssClass: "blind-button icon-button",
    onClick: () => {
      globals.blindMode = !globals.blindMode;
      setLocalStorageItem(LocalStorageKey.BLIND, !!globals.blindMode);
      updateBlindButtonText();
      updateScoreModifiers();
      if (globals.mute && globals.blindMode) {
        muteButton.click();
      }
    },
  });
  updateBlindButtonText();

  languageButton = createElement({
    tag: "button",
    cssClass: "language-button icon-button",
    text: "🌐",
    onClick: () => {
      toggleConfig(function onChange() {
        updateLanguageButtonText();
        updateScoreModifiers();
      });
    },
  });
  updateLanguageButtonText();

  const goalContainer = createElement({
    cssClass: "goal-input",
    text: "Number of emojis per game:",
  });
  goalInput = createElement({ tag: "input" });
  goalInput.type = "number";
  goalInput.min = MIN_GOAL;
  goalInput.max = MAX_GOAL;
  goalInput.addEventListener("blur", validateGoal);
  goalInput.addEventListener("change", updateScoreModifiers);
  goalContainer.appendChild(goalInput);

  scoreModifiers = createElement({ cssClass: "score-modifiers" });
  updateScoreModifiers();

  const iconButtons = createElement({ cssClass: "icon-buttons" });
  iconButtons.appendChild(muteButton);
  iconButtons.appendChild(blindButton);
  iconButtons.appendChild(languageButton);

  configScreen.appendChild(iconButtons);
  configScreen.appendChild(goalContainer);
  configScreen.appendChild(createModeSwitcher(updateAll));
  configScreen.appendChild(scoreModifiers);
}

function validateGoal() {
  const goal = goalInput.value;
  const max = Math.min(MAX_GOAL, splitEmojis(getEmojiPool()).length);
  if (goal < MIN_GOAL) {
    goalInput.value = MIN_GOAL;
  } else if (goal > max) {
    goalInput.value = max;
  }
  updateScoreModifiers();
}

function updateScoreModifiers() {
  if (globals.practiceMode) {
    scoreModifiers.innerHTML = "";
  } else {
    if (isEndOfGame()) return;
    scoreModifiers.innerHTML = `&nbsp;✅: +${getPointsByAction(
      ScoreAction.CORRECT,
      getGoalInputValue()
    )}&nbsp; ❌: ${getPointsByAction(ScoreAction.WRONG, getGoalInputValue())}`;
  }
}

function updateMuteButtonText() {
  if (globals.practiceMode) {
    muteButton.innerHTML = globals.mute ? "🔇" : "🔊";
  } else {
    muteButton.innerHTML = globals.mute ? "🔇&nbsp; x1.5" : "🔊&nbsp; x1";
  }
}

function updateBlindButtonText() {
  if (globals.practiceMode) {
    blindButton.innerHTML = globals.blindMode ? "🙈" : "👁️";
  } else {
    blindButton.innerHTML = globals.blindMode ? "🙈&nbsp; x3" : "👁️&nbsp; x1";
  }
}

function updateLanguageButtonText() {
  const languages = getLanguagesText() ?? "";
  const langCount = languages.split(",").length;
  languageButton.innerHTML = `🌐&nbsp; (${langCount || 1})`;
  languageButton.setAttribute("title", getLanguagesText());
}

function getGoalInputValue() {
  return goalInput?.value ? Number(goalInput.value) : globals.level;
}
