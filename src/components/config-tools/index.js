import { createElement } from "../../utils/html-utils";
import { DEFAULT_LEVEL, globals, setLevel } from "../../globals";

import "./config-tools.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

let muteButton, blindButton, inputTimeout, levelInput;
const MIN_LEVEL = 3;
const MAX_LEVEL = 13;

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  muteButton = createElement({
    tag: "button",
    cssClass: "mute-button",
    onClick: () => {
      globals.mute = !globals.mute;
      setLocalStorageItem(LocalStorageKey.MUTE, !!globals.mute);
      updateMuteButtonText();
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
    },
  });
  updateBlindButtonText();

  levelInput = createElement({ tag: "input" });
  levelInput.setAttribute("type", "number");
  levelInput.addEventListener("change", (event) => {
    onLevelInputChange(Number(event.target.value));
  });
  levelInput.value = globals.level;
  configTools.appendChild(levelInput);

  configTools.appendChild(muteButton);
  configTools.appendChild(blindButton);

  return configTools;
}

function updateMuteButtonText() {
  muteButton.innerHTML = globals.mute ? "🔇" : "🔊";
}

function updateBlindButtonText() {
  blindButton.innerHTML = globals.blindMode ? "🙈" : "👁️";
}

function onLevelInputChange(value) {
  if (globals.level === value) return;

  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(() => {
    const validatedLevel =
      typeof value === "number"
        ? Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, value))
        : DEFAULT_LEVEL;
    if (validatedLevel !== globals.level) {
      let reloadPage = true;
      if (globals.clickCounter > 0) {
        reloadPage = window.confirm("Want to reload?");
      }
      if (reloadPage) {
        setLevel(validatedLevel);
        levelInput.value = validatedLevel;
        window.location.reload();
      } else {
        levelInput.value = globals.level;
      }
    }
  }, 1000);
}
