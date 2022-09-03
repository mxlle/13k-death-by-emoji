import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";

import "./mode-switcher.scss";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { newGame } from "../../game-logic";

export function createModeSwitcher() {
  const modeSwitcher = createElement({ cssClass: "mode-switcher" });
  const infiniteButton = createElement({
    tag: "button",
    text: "Sudden death",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, false);
      infiniteButton.classList.add("active");
      practiceButton.classList.remove("active");
      newGame();
    },
  });
  const practiceButton = createElement({
    tag: "button",
    text: "Practice",
    onClick: () => {
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, true);
      infiniteButton.classList.remove("active");
      practiceButton.classList.add("active");
      newGame();
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
