import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";

import "./mode-switcher.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

export function createModeSwitcher(onModeChangeCallback) {
  const modeSwitcher = createElement({
    cssClass: "mode-switcher",
    text: "Mode: ",
  });
  const infiniteButton = createElement({
    tag: "button",
    text: "Sudden death",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, false);
      globals.practiceMode = false;
      infiniteButton.classList.add("active");
      practiceButton.classList.remove("active");
      if (onModeChangeCallback) onModeChangeCallback();
    },
  });
  const practiceButton = createElement({
    tag: "button",
    text: "Practice",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, true);
      globals.practiceMode = true;
      infiniteButton.classList.remove("active");
      practiceButton.classList.add("active");
      if (onModeChangeCallback) onModeChangeCallback();
    },
  });

  if (globals.practiceMode) {
    practiceButton.classList.add("active");
  } else {
    infiniteButton.classList.add("active");
  }

  modeSwitcher.appendChild(infiniteButton);
  modeSwitcher.appendChild(practiceButton);

  return modeSwitcher;
}
