import { shuffleArray } from "./utils/random-utils";

import "./index.scss";
import { splitEmojis } from "./emojis/emoji-util";
import { buttonMap, initEmojiButtonField } from "./components/emoji-buttons";
import { createStorytellerButton } from "./components/storyteller";

import { globals, isEndOfGame, isSpaceDucksVariant } from "./globals";
import {
  createSecretSequenceComponent,
  updateSecretSequenceComponent,
} from "./components/secret-sequence";
import { createConfigTools } from "./components/config-tools";
import { createScoreboard, updateHighScore } from "./components/score";
import { createVoiceSelector } from "./components/config-tools/voice-config";
import { createElement } from "./utils/html-utils";
import { createModeSwitcher } from "./components/mode-switcher";

let storytellerButton;

function initGameData() {
  globals.emojiSet = shuffleArray(splitEmojis(globals.emojiPool)).slice(
    0,
    globals.level
  );
  if (globals.practiceMode) {
    globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
    globals.correctMatches = globals.emojiSet.map(() => false);
  }
}

function init() {
  if (isSpaceDucksVariant()) {
    document.title = "Space ducks emoji vocabulary";
  }

  initGameData();

  document.body.appendChild(createVoiceSelector());

  const header = createElement({ tag: "header" });

  header.appendChild(createConfigTools());
  header.appendChild(createScoreboard());
  document.body.appendChild(header);

  document.body.appendChild(
    createElement({
      cssClass: "info-text",
      text: "Listen to the secret emoji sequence and replicate it with the buttons below at the same time.",
    })
  );

  document.body.appendChild(createSecretSequenceComponent());

  storytellerButton = createStorytellerButton();
  document.body.appendChild(storytellerButton);

  document.body.appendChild(
    initEmojiButtonField(globals.emojiSet, afterEmojiButtonClick)
  );

  document.body.appendChild(createModeSwitcher());
}

function afterEmojiButtonClick() {
  updateSecretSequenceComponent();
  if (isEndOfGame()) {
    endOfGame();
  }
}

function endOfGame() {
  if (globals.practiceMode) {
    let correctCount = globals.shuffledEmojis.length;
    for (let i = 0; i < globals.shuffledEmojis.length; i++) {
      if (!globals.correctMatches[i]) {
        buttonMap[globals.shuffledEmojis[i]].classList.add("wrong");
        correctCount--;
      }
    }
  }
  storytellerButton.innerHTML = "Play again";
  updateHighScore();
}

// INIT
init();
