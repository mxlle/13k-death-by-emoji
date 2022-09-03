import { createDialog } from "../dialog";
import { createElement } from "../../utils/html-utils";
import { newGame } from "../../game-logic";
import { showConfigScreen } from "../config-tools/config-screen";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

import "./new-game-screen.scss";
import { globals } from "../../globals";
import {
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import {
  getResultAndRecordText,
  getScore,
  getScoreAndHighScoreText,
} from "../score";

let newGameScreen, dialog, replayButton, playOtherModeButton, gameOverSection;

pubSubService.subscribe(PubSubEvent.GAME_OVER, () =>
  setTimeout(() => openNewGameScreen(false, true), 500)
);

export function openNewGameScreen(openImmediately = false, isGameOver = false) {
  if (!newGameScreen) createNewGameScreen();
  if (!dialog) dialog = createDialog(newGameScreen, undefined, "Select game");

  let playButtonText;
  if (isGameOver) {
    const headerText = globals.practiceMode
      ? "🐥 Practice game complete 🐥"
      : "☠️☠️️☠️ Game over ️☠️️☠️️☠️";
    dialog.changeHeader(headerText);
    playButtonText = " Play again";
  } else {
    dialog.changeHeader("Select game");
    playButtonText = " Start game";
  }
  replayButton.innerHTML =
    (globals.practiceMode ? "🐣" : "☠️") + playButtonText;

  playOtherModeButton.innerHTML = globals.practiceMode
    ? "☠️ Switch to Sudden Death"
    : "🐣 Switch to Practice";

  setGameOverSection(isGameOver);

  void dialog.open(openImmediately);
}

function setGameOverSection(isGameOver) {
  gameOverSection.classList.toggle("hidden", !isGameOver);
  gameOverSection.classList.toggle(
    "negative",
    globals.practiceMode
      ? globals.correctCount < globals.shuffledEmojis.length
      : getScore() <= 0
  );
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
    text: "⚙️ Configuration",
    onClick: async () => {
      const submit = await showConfigScreen();
      if (submit) dialog.close();
    },
  });
  newGameScreen.appendChild(gameOverSection);
  newGameScreen.appendChild(replayButton);
  newGameScreen.appendChild(playOtherModeButton);
  newGameScreen.appendChild(configButton);
}
