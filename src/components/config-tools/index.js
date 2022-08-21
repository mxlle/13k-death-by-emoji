import { createElement } from "../../utils/html-utils";
import { globals, isEndOfGame } from "../../globals";

import "./config-tools.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { getPointsByAction, ScoreAction } from "../score";
import { getLanguagesText, toggleConfig } from "./voice-config";
import { showConfigScreen } from "./config-screen";

let muteButton, blindButton, languageButton, scoreModifiers;

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  muteButton = createElement({
    tag: "button",
    cssClass: "mute-button",
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
    cssClass: "blind-button",
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
    cssClass: "language-button",
    text: "🌐",
    onClick: () => {
      toggleConfig(function onChange() {
        updateLanguageButtonText();
        updateScoreModifiers();
      });
    },
  });
  updateLanguageButtonText();

  scoreModifiers = createElement({ cssClass: "score-modifiers" });
  updateScoreModifiers();

  configTools.appendChild(
    createElement({
      tag: "button",
      cssClass: "emoji",
      text: "⚙️",
      onClick: () => showConfigScreen(),
    })
  );

  configTools.appendChild(muteButton);
  configTools.appendChild(blindButton);
  configTools.appendChild(languageButton);
  configTools.appendChild(scoreModifiers);

  return configTools;
}

export function updateScoreModifiers() {
  if (isEndOfGame()) return;
  const combo = globals.streak > 1 ? `&nbsp; Combo: x${globals.streak}` : "";
  scoreModifiers.innerHTML = `&nbsp;✅: +${getPointsByAction(
    ScoreAction.CORRECT
  )}&nbsp; ❌: ${getPointsByAction(ScoreAction.WRONG)}${combo}`;
}

function updateMuteButtonText() {
  muteButton.innerHTML = globals.mute ? "🔇&nbsp; x1.5" : "🔊&nbsp; x1";
}

function updateBlindButtonText() {
  blindButton.innerHTML = globals.blindMode ? "🙈&nbsp; x2" : "👁️&nbsp; x1";
}

function updateLanguageButtonText() {
  const languages = getLanguagesText() ?? "";
  const langCount = languages.split(",").length;
  languageButton.innerHTML = `🌐&nbsp; x${langCount || 1}`;
  languageButton.setAttribute("title", getLanguagesText());
}
