import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";

import "./mode-switcher.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

export function createModeSwitcher() {
  const modeSwitcher = createElement({ cssClass: "mode-switcher" });
  const infiniteButton = createElement({
    tag: "button",
    text: "Sudden death",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, false);
      window.location.reload();
    },
  });
  const practiceButton = createElement({
    tag: "button",
    text: "Practice",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, true);
      window.location.reload();
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
