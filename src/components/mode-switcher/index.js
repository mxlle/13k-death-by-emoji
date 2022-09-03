import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";

import "./mode-switcher.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

export function createModeSwitcher(onModeChangeCallback) {
  const switchButton = createElement({
    tag: "button",
    cssClass: "icon-button",
    onClick: () => {
      globals.practiceMode = !globals.practiceMode;
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, globals.practiceMode);
      adjustText();
      if (onModeChangeCallback) onModeChangeCallback();
    },
  });

  const modeInfo = createElement({
    cssClass: "mode-info",
  });

  adjustText();

  function adjustText() {
    switchButton.innerHTML = globals.practiceMode
      ? "🐣 Practice"
      : "☠️ Sudden death";
    modeInfo.innerHTML = globals.practiceMode
      ? "Definite sequence that can be repeated any number of times."
      : `Infinite sequence of emojis, you cannot fall behind more than ${globals.slots} slots or you'll die.`;
  }

  return { switchButton, modeInfo };
}
