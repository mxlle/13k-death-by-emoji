import "./game-preconfigs.scss";

import { createElement } from "../../../utils/html-utils";
import {
  EMOJI_POOL_CUSTOM_NAME,
  MAX_GOAL,
  MIN_GOAL,
  setEmojiPool,
  setGameConfig,
} from "../../../globals";
import { newGame } from "../../../game-logic";
import { gamePreconfigs } from "./preconfigs";
import { getRandomItem } from "../../../utils/array-utils";
import { allOldEmojis } from "../../../emojis/sets";
import {
  randomIntFromInterval,
  shuffleArray,
} from "../../../utils/random-utils";
import { splitEmojis } from "../../../emojis/emoji-util";
import { preselections } from "../../config-tools/emoji-selection/preselections";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../../utils/local-storage";

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
          level: randomIntFromInterval(MIN_GOAL, MAX_GOAL),
        });
        setEmojiPool(
          shuffleArray(splitEmojis(allOldEmojis)).slice(0, MAX_GOAL)
        );
        setLocalStorageItem(
          LocalStorageKey.EMOJI_POOL_NAME,
          EMOJI_POOL_CUSTOM_NAME
        );
        newGame();
      } else {
        setGameConfig(preconfig.config);
        setEmojiPool(preconfig.emojiPool ?? preselections[0].emojis);
        const emojiPoolName =
          preconfig.emojiPoolName ??
          (preconfig.emojiPool
            ? EMOJI_POOL_CUSTOM_NAME
            : preselections[0].name);
        setLocalStorageItem(LocalStorageKey.EMOJI_POOL_NAME, emojiPoolName);
        newGame();
      }
      setLocalStorageItem(LocalStorageKey.CURRENT_GAME, preconfig.id);

      onSelect?.();
    },
  });
  const icon = createElement({ text: preconfig.icon, cssClass: "icon" });
  const text = createElement({ text: preconfig.name, cssClass: "text" });

  gamePreconfigButton.appendChild(icon);
  gamePreconfigButton.appendChild(text);

  return gamePreconfigButton;
}
