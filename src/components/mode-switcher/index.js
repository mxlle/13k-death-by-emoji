import { appendEmoji, createElement } from "../../utils/html-utils";
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
    switchButton.innerHTML = "";
    appendEmoji(
      switchButton,
      globals.practiceMode ? "🐣 Practice" : "☠️ Sudden death"
    );
    modeInfo.innerHTML = globals.practiceMode
      ? "In the Practice mode you have to replicate a limited non-repeating sequence. You can listen to it as many times as you want."
      : `In Sudden Death mode you have to keep up with an infinite sequence. If you fall ${globals.slots} slots behind you'll die. Each mistake costs you a slot.`;
  }

  return { switchButton, modeInfo, adjustText };
}
