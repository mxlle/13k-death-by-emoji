import "./index.scss";
import { initEmojiButtonField } from "./components/emoji-buttons";
import { createStorytellerButton } from "./components/storyteller";

import { globals, isSpaceDucksVariant } from "./globals";
import { createSecretSequenceComponent } from "./components/secret-sequence";
import { createConfigTools } from "./components/config-tools";
import { createScoreboard } from "./components/score";
import { createVoiceSelector } from "./components/config-tools/voice-config";
import { createElement } from "./utils/html-utils";
import { createModeSwitcher } from "./components/mode-switcher";
import { initGameData } from "./game-logic";

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

  const info = createElement({
    cssClass: "info-text",
    text: "Listen to the secret emoji sequence and replicate it with the buttons below at the same time.",
  });

  info.appendChild(createElement({ tag: "br" }));
  info.appendChild(document.createTextNode("Try the blind mode if you dare. "));

  if (!globals.practiceMode) {
    info.appendChild(createElement({ tag: "br" }));
    info.appendChild(
      document.createTextNode("Keep up before your slots run out!")
    );
  }

  document.body.appendChild(info);

  document.body.appendChild(createSecretSequenceComponent());

  document.body.appendChild(createStorytellerButton());

  document.body.appendChild(initEmojiButtonField(globals.emojiSet));

  document.body.appendChild(createModeSwitcher());
}

// INIT
init();
