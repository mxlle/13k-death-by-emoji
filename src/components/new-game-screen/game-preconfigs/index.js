import "./game-preconfigs.scss";

import { createElement } from "../../../utils/html-utils";
import { MAX_GOAL, MIN_GOAL, setGameConfig } from "../../../globals";
import { newGame } from "../../../game-logic";
import { gamePreconfigs } from "./preconfigs";
import { getRandomItem } from "../../../utils/array-utils";
import { allOldEmojis } from "../../../emojis/sets";
import { randomInt } from "../../../utils/random-utils";

export function createGamePreconfigs(onSelect) {
  const gamePreconfigsContainer = createElement({
    cssClass: "game-preconfigs",
  });

  gamePreconfigs.forEach((preconfig) => {
    gamePreconfigsContainer.appendChild(
      createGamePreconfigButton(preconfig, onSelect)
    );
  });

  return gamePreconfigsContainer;
}

function createGamePreconfigButton(preconfig, onSelect) {
  const gamePreconfigButton = createElement({
    tag: "button",
    cssClass: "preconfig-button secondary-button",
    onClick: () => {
      if (preconfig.surpriseMe) {
        setGameConfig({
          practiceMode: getRandomItem([true, false]),
          blindMode: getRandomItem([true, false]),
          level: randomInt(MIN_GOAL, MAX_GOAL),
        });
        newGame(allOldEmojis);
      } else {
        setGameConfig(preconfig.config);
        newGame(preconfig.emojiPool);
      }

      onSelect?.();
    },
  });
  const icon = createElement({ text: preconfig.icon, cssClass: "icon" });
  const text = createElement({ text: preconfig.name, cssClass: "text" });

  gamePreconfigButton.appendChild(icon);
  gamePreconfigButton.appendChild(text);

  return gamePreconfigButton;
}
