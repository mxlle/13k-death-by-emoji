import { createDialog } from "../dialog";
import {
  appendRainbowCapableText,
  createButton,
  createElement,
} from "../../utils/html-utils";
import { getGameCountToSave, newGame } from "../../game-logic";
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
import { getResultAndRecordText, getScoreAndHighScoreText } from "../score";
import { createGamePreconfigs } from "./game-preconfigs";
import { speak } from "../../speech/speech";
import { createStarComponent, getAchievedStars } from "../stars";
import { gamePreconfigs } from "./game-preconfigs/preconfigs";

let newGameScreen, dialog, replayButton, gameOverSection, configButton;

pubSubService.subscribe(PubSubEvent.GAME_OVER, () =>
  setTimeout(() => openNewGameScreen(false, true), 500)
);

export function openNewGameScreen(openImmediately = false, isGameOver = false) {
  if (!newGameScreen) createNewGameScreen();
  if (!dialog) dialog = createDialog(newGameScreen, undefined, "Select game");

  const lastGameWasCustom =
    getLocalStorageItem(LocalStorageKey.CURRENT_GAME) === CUSTOM_GAME_ID;
  const showBigPlayButton = isGameOver || lastGameWasCustom;

  let playButtonText;
  if (isGameOver) {
    const headerText = globals.practiceMode
      ? "🐥 Practice game complete 🐥"
      : "☠️☠️️☠️ Game over ️☠️️☠️️☠️";
    dialog.changeHeader(headerText);
    playButtonText = "Play again";
  } else {
    dialog.changeHeader("Select game");
    playButtonText = "Previous config";
  }

  replayButton.classList.toggle("hidden", !showBigPlayButton);
  newGameScreen.classList.toggle("no-big-play-btn", !showBigPlayButton);
  newGameScreen.classList.toggle("prefer-custom", lastGameWasCustom);

  if (showBigPlayButton) {
    replayButton.innerHTML = "";
    const playModeText =
      (globals.practiceMode ? "🐣" : "☠️") + (globals.blindMode ? "🗣️" : "👁️");
    const emojiSetText = getRandomEmojisFromPool().join("");
    const emojiCountText = `(${globals.level})`;
    appendRainbowCapableText(replayButton, isGameOver ? "↩" : "▶");
    appendRainbowCapableText(replayButton, playButtonText);
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
  }

  setGameOverSection(isGameOver);

  void dialog.open(openImmediately);
}

function closeDialog() {
  speak(""); // to init speech
  dialog.close();
}

function setGameOverSection(isGameOver) {
  gameOverSection.classList.toggle("hidden", !isGameOver);
  const achievedStars = getAchievedStars(
    undefined,
    globals.practiceMode,
    globals.shuffledEmojis?.length,
    getGameCountToSave()
  );

  gameOverSection.classList.toggle("negative", achievedStars === 0);
  gameOverSection.classList.toggle("good", achievedStars === 3);
  newGameScreen.classList.toggle("has-game-over-section", isGameOver);
  gameOverSection.innerHTML = "";
  if (isGameOver) {
    gameOverSection.appendChild(createStarComponent(achievedStars));
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
  replayButton = createButton({
    onClick: () => {
      closeDialog();
      const preconfigId = getLocalStorageItem(LocalStorageKey.CURRENT_GAME);
      const preconfig = gamePreconfigs.find((p) => p.id === preconfigId);
      void newGame(preconfig?.useSecondLanguage);
    },
  });
  replayButton.classList.add("replay-btn");

  configButton = createButton({
    onClick: async () => {
      const submit = await showConfigScreen();
      if (submit) {
        setLocalStorageItem(LocalStorageKey.CURRENT_GAME, CUSTOM_GAME_ID);
        closeDialog();
      }
    },
  });
  configButton.classList.add("config-btn");
  const icon = createElement({ cssClass: "icon" });
  const text = createElement({ cssClass: "text" });
  icon.appendChild(createElement({ text: "⚙️" }));
  text.appendChild(createElement({ text: "Custom game" }));
  configButton.appendChild(icon);
  configButton.appendChild(text);

  newGameScreen.appendChild(gameOverSection);
  newGameScreen.appendChild(replayButton);
  newGameScreen.appendChild(createGamePreconfigs(closeDialog));
  newGameScreen.appendChild(configButton);
}
