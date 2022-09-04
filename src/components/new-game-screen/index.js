import { createDialog } from "../dialog";
import { createElement } from "../../utils/html-utils";
import { newGame } from "../../game-logic";
import { showConfigScreen } from "../config-tools/config-screen";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

import "./new-game-screen.scss";
import {
  CUSTOM_GAME_ID,
  getRandomEmojisFromPool,
  globals,
} from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import {
  getResultAndRecordText,
  getScore,
  getScoreAndHighScoreText,
} from "../score";
import { createGamePreconfigs } from "./game-preconfigs";

let newGameScreen, dialog, replayButton, playOtherModeButton, gameOverSection;

pubSubService.subscribe(PubSubEvent.GAME_OVER, () =>
  setTimeout(() => openNewGameScreen(false, true), 500)
);

export function openNewGameScreen(openImmediately = false, isGameOver = false) {
  if (!newGameScreen) createNewGameScreen();
  if (!dialog) dialog = createDialog(newGameScreen, undefined, "Select game");

  const showBigPlayButton =
    isGameOver ||
    getLocalStorageItem(LocalStorageKey.CURRENT_GAME) === CUSTOM_GAME_ID;

  let playButtonText;
  if (isGameOver) {
    const headerText = globals.practiceMode
      ? "🐥 Practice game complete 🐥"
      : "☠️☠️️☠️ Game over ️☠️️☠️️☠️";
    dialog.changeHeader(headerText);
    playButtonText = "Play again";
  } else {
    dialog.changeHeader("Select game");
    playButtonText = "Start game";
  }

  replayButton.classList.toggle("hidden", !showBigPlayButton);
  replayButton.classList.toggle("no-big-play-button", !showBigPlayButton);
  if (showBigPlayButton) {
    replayButton.innerHTML = "";
    const playModeText =
      (globals.practiceMode ? "🐣" : "☠️") + (globals.blindMode ? "🗣️" : "👁️");
    const emojiSetText = getRandomEmojisFromPool().join("");
    const emojiCountText = `(${globals.level})`;
    replayButton.appendChild(createElement({ text: isGameOver ? "🔄" : "▶️" }));
    replayButton.appendChild(createElement({ text: playButtonText }));
    const configInfo = createElement({ cssClass: "config-info" });

    configInfo.appendChild(
      createElement({ text: playModeText, cssClass: "play-mode" })
    );
    configInfo.appendChild(
      createElement({ text: emojiSetText, cssClass: "emoji-set" })
    );
    configInfo.appendChild(
      createElement({ text: emojiCountText, cssClass: "emoji-count" })
    );
    replayButton.appendChild(configInfo);

    playOtherModeButton.innerHTML = globals.practiceMode
      ? "☠️ Switch to Sudden Death"
      : "🐣 Switch to Practice";
  }

  setGameOverSection(isGameOver);

  void dialog.open(openImmediately);
}

function setGameOverSection(isGameOver) {
  gameOverSection.classList.toggle("hidden", !isGameOver);
  const isNegative = globals.practiceMode
    ? globals.correctCount < globals.shuffledEmojis.length
    : getScore() <= 0;
  gameOverSection.classList.toggle("negative", isNegative);
  newGameScreen.classList.toggle("has-game-over-section", isGameOver);
  gameOverSection.innerHTML = "";
  if (isGameOver) {
    gameOverSection.appendChild(
      createElement({ text: getResultAndRecordText() })
    );
    if (!globals.practiceMode) {
      gameOverSection.appendChild(
        createElement({ text: getScoreAndHighScoreText() })
      );
    }
  }
}

function createNewGameScreen() {
  newGameScreen = createElement({ cssClass: "new-game-screen" });
  gameOverSection = createElement({ cssClass: "game-over-section hidden" });
  replayButton = createElement({
    tag: "button",
    cssClass: "replay-button secondary-button",
    text: "Start game",
    onClick: () => {
      dialog.close();
      void newGame();
    },
  });
  playOtherModeButton = createElement({
    tag: "button",
    cssClass: "secondary-button",
    text: "Toggle game mode",
    onClick: () => {
      globals.practiceMode = !globals.practiceMode;
      setLocalStorageItem(LocalStorageKey.PRACTICE_MODE, globals.practiceMode);
      dialog.close();
      void newGame();
    },
  });
  const configButton = createElement({
    tag: "button",
    cssClass: "secondary-button",
    onClick: async () => {
      const submit = await showConfigScreen();
      if (submit) {
        setLocalStorageItem(LocalStorageKey.CURRENT_GAME, CUSTOM_GAME_ID);
        dialog.close();
      }
    },
  });
  const icon = createElement({ text: "⚙️", cssClass: "icon" });
  const text = createElement({ text: "Custom game", cssClass: "text" });
  configButton.appendChild(icon);
  configButton.appendChild(text);

  const gamePreconfigs = createGamePreconfigs(() => dialog.close());

  newGameScreen.appendChild(gameOverSection);
  newGameScreen.appendChild(replayButton);
  newGameScreen.appendChild(gamePreconfigs);
  //newGameScreen.appendChild(playOtherModeButton);
  newGameScreen.appendChild(configButton);
}
