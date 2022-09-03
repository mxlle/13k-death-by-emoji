import "./index.scss";

import { isSpaceDucksVariant } from "./globals";
import { createConfigTools } from "./components/config-tools";
import { createScoreboard } from "./components/score";
import { createVoiceSelector } from "./components/config-tools/voice-config";
import { createElement } from "./utils/html-utils";
import { initGameData } from "./game-logic";
import { createGameField } from "./components/game-field";

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
}

// INIT
init();
