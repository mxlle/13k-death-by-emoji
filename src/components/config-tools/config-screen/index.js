import "./config-screen.scss";

import { createElement } from "../../../utils/html-utils";
import { getEmojiPool, globals, isEndOfGame, setLevel } from "../../../globals";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";
import { getPointsByAction, newGame, ScoreAction } from "../../../game-logic";
import { createEmojiSelectionButton } from "../emoji-selection";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";
import { getLanguagesText, toggleConfig } from "../voice-config";
import { createModeSwitcher } from "../../mode-switcher";
import { createNumberInputComponent } from "../../number-input";

const MIN_GOAL = 3;
const MAX_GOAL = 20;

let configScreen, dialog, goalInputComponent;
let blindButton, languageButton, scoreModifiers;

export async function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  if (!dialog)
    dialog = createDialog(configScreen, "Load game", "Configuration");
  goalInputComponent.input.value = globals.level;

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
  updateLanguageButtonText();
}

function createConfigScreen() {
  configScreen = createElement({
    cssClass: "config",
    onClick: (event) => event.stopPropagation(),
  });
  configScreen.appendChild(createEmojiSelectionButton(() => validateGoal()));

  blindButton = createElement({
    tag: "button",
    cssClass: "blind-button icon-button",
    onClick: () => {
      globals.blindMode = !globals.blindMode;
      setLocalStorageItem(LocalStorageKey.BLIND, !!globals.blindMode);
      updateBlindButtonText();
      updateScoreModifiers();
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
  goalInputComponent = createNumberInputComponent({
    min: MIN_GOAL,
    max: MAX_GOAL,
    onBlur: validateGoal,
    onChange: updateScoreModifiers,
  });
  goalContainer.appendChild(goalInputComponent.container);

  scoreModifiers = createElement({ cssClass: "score-modifiers" });
  updateScoreModifiers();

  const iconButtons = createElement({ cssClass: "icon-buttons" });
  iconButtons.appendChild(blindButton);
  iconButtons.appendChild(languageButton);

  configScreen.appendChild(iconButtons);
  configScreen.appendChild(goalContainer);
  configScreen.appendChild(createModeSwitcher(updateAll));
  configScreen.appendChild(scoreModifiers);
}

function validateGoal() {
  if (!goalInputComponent) return;
  goalInputComponent.input.max = Math.min(
    MAX_GOAL,
    splitEmojis(getEmojiPool()).length
  );
  goalInputComponent.validate();
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
  return goalInputComponent?.input.value
    ? Number(goalInputComponent.input.value)
    : globals.level;
}
