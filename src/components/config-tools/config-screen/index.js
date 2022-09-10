import "./config-screen.scss";

import {
  appendRainbowCapableText,
  createButton,
  createElement,
} from "../../../utils/html-utils";
import {
  CUSTOM_GAME_ID,
  getEmojiPool,
  globals,
  MAX_GOAL,
  MIN_GOAL,
  setLevel,
  setRainbowMode,
} from "../../../globals";
import { splitEmojis } from "../../../emojis/emoji-util";
import { createDialog } from "../../dialog";
import { getPointsByAction, newGame, ScoreAction } from "../../../game-logic";
import {
  createEmojiSelectionButton,
  updateEmojiSelectionButtonText,
} from "../emoji-selection";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";
import { getLanguagesText, toggleConfig } from "../voice-config";
import { createModeSwitcher } from "../../mode-switcher";
import { createNumberInputComponent } from "../../number-input";

let configScreen, dialog, goalInputComponent, rainbowButton;
let blindButton, languageButton, scoreModifiers, adjustGameModeTexts;

export async function showConfigScreen() {
  if (!configScreen) createConfigScreen();
  if (!dialog)
    dialog = createDialog(configScreen, "Load game", "Configuration");
  goalInputComponent.input.value = globals.level;

  updateAll();

  const submit = await dialog.open();
  if (submit) onConfigSubmitted();

  return submit;
}

function onConfigSubmitted() {
  const goal = getGoalInputValue();
  setLevel(goal);
  setLocalStorageItem(LocalStorageKey.CURRENT_GAME, CUSTOM_GAME_ID);
  newGame();
}

function updateAll() {
  updateScoreModifiers();
  updateBlindButtonText();
  updateLanguageButtonText();
  updateEmojiSelectionButtonText();
  updateRainbowButtonText();
  adjustGameModeTexts?.();
  configScreen.classList.toggle("practice-mode", globals.practiceMode);
}

function createConfigScreen() {
  configScreen = createElement({
    cssClass: "config",
    onClick: (event) => event.stopPropagation(),
  });

  blindButton = createButton({
    iconBtn: true,
    onClick: () => {
      globals.blindMode = !globals.blindMode;
      setLocalStorageItem(LocalStorageKey.BLIND, !!globals.blindMode);
      updateBlindButtonText();
      updateScoreModifiers();
    },
  });
  updateBlindButtonText();

  languageButton = createButton({
    iconBtn: true,
    onClick: () => {
      toggleConfig(function onChange() {
        updateLanguageButtonText();
        updateScoreModifiers();
      });
    },
  });
  updateLanguageButtonText();

  goalInputComponent = createNumberInputComponent({
    value: globals.level,
    min: MIN_GOAL,
    max: MAX_GOAL,
    onBlur: validateGoal,
    onChange: updateScoreModifiers,
  });

  rainbowButton = createButton({
    iconBtn: true,
    onClick: () => {
      setRainbowMode(!globals.rainbowMode);
      updateRainbowButtonText();
    },
  });
  updateRainbowButtonText();

  const { switchButton, modeInfo, adjustText } = createModeSwitcher(updateAll);
  adjustGameModeTexts = adjustText;

  scoreModifiers = createElement({ cssClass: "score-modifiers" });
  updateScoreModifiers();

  // Append entries

  addConfigEntry("Play mode:", switchButton);
  addConfigEntry("", modeInfo, "info");

  addConfigEntry("Presentation mode:", blindButton);

  addConfigEntry("Language:", languageButton);

  addConfigEntry("Number of emojis:", goalInputComponent.container);

  addConfigEntry(
    "Emoji set:",
    createEmojiSelectionButton(() => validateGoal())
  );

  addConfigEntry("Rainbow mode:", rainbowButton);

  addConfigEntry("Resulting score:", scoreModifiers, "sudden-death-only info");
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
    scoreModifiers.innerHTML = "❌";
  } else {
    scoreModifiers.innerHTML = `&nbsp;✅: +${getPointsByAction(
      ScoreAction.CORRECT,
      getGoalInputValue()
    )}&nbsp; ❌: ${getPointsByAction(ScoreAction.WRONG, getGoalInputValue())}`;
  }
}

function updateBlindButtonText() {
  blindButton.innerHTML = "";
  appendRainbowCapableText(blindButton, globals.blindMode ? "🗣️" : "🗣️ + 👁️");
}

function updateRainbowButtonText() {
  rainbowButton.innerHTML = "";
  appendRainbowCapableText(rainbowButton, globals.rainbowMode ? "on" : "off");
}

function updateLanguageButtonText() {
  const languages = getLanguagesText() ?? "";
  languageButton.innerHTML = "";
  appendRainbowCapableText(
    languageButton,
    languages.length > 0 ? `${languages}` : "🌐"
  );
}

function getGoalInputValue() {
  return goalInputComponent?.input.value
    ? Number(goalInputComponent.input.value)
    : globals.level;
}

function addConfigEntry(label, element, cssClass) {
  configScreen.appendChild(
    createElement({
      text: label,
      cssClass: `label${cssClass ? " " + cssClass : ""}`,
    })
  );
  const valueContainer = createElement({
    cssClass: `value${cssClass ? " " + cssClass : ""}`,
  });
  valueContainer.appendChild(element);
  configScreen.appendChild(valueContainer);
}
