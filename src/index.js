import "./index.scss";

import { createConfigTools } from "./components/config-tools";
import { createScoreboard } from "./components/score";
import { createVoiceSelector } from "./components/config-tools/voice-config";
import { createElement } from "./utils/html-utils";
import { initGameData } from "./game-logic";
import { openNewGameScreen } from "./components/new-game-screen";
import { createGameField } from "./components/game-field";
import { isSpaceDucksVariant } from "./utils/local-storage";

function init() {
  if (isSpaceDucksVariant()) {
    document.title = "Space ducks emoji vocabulary";
  } else {
    document.title = "Death by emoji";
  }

  initGameData();

  document.body.appendChild(createVoiceSelector());

  const header = createElement({ tag: "header" });

  header.appendChild(createConfigTools());
  header.appendChild(createScoreboard());
  document.body.appendChild(header);

  document.body.appendChild(createGameField());

  openNewGameScreen(true);
}

// INIT
init();
export { EMOJI_POOL_CUSTOM_NAME } from "./globals";
