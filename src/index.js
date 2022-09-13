import "./index.scss";

import { createConfigTools } from "./components/config-tools";
import { createScoreboard } from "./components/score";
import { createVoiceSelector } from "./components/config-tools/voice-config";
import { createElement } from "./utils/html-utils";
import { initGameData } from "./game-logic";
import { openNewGameScreen } from "./components/new-game-screen";
import { createGameField } from "./components/game-field";
import { isSpaceDucksVariant } from "./utils/local-storage";
import { getStarsForGameField } from "./components/stars";

function init() {
  if (isSpaceDucksVariant()) {
    document.title = "Space ducks emoji vocabulary";
  } else {
    document.title = "Deadly echo";
  }

  initGameData();

  const header = createElement({ tag: "header" });

  header.appendChild(createConfigTools());
  header.appendChild(createScoreboard());
  header.appendChild(getStarsForGameField());

  document.body.appendChild(header);

  document.body.appendChild(createGameField());

  createVoiceSelector();

  openNewGameScreen(true);
}

// INIT
init();
export { EMOJI_POOL_CUSTOM_NAME } from "./globals";
export { getCurrentAchievedStars } from "./game-logic";
export { getAchievedStars } from "./game-logic";
