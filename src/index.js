import { animals } from "./emojis/sets";
import { shuffleArray } from "./utils/random-utils";

import "./index.scss";
import { splitEmojis } from "./emojis/emoji-util";
import { buttonMap, initEmojiButtonField } from "./components/emoji-buttons";
import {
  createStorytellerButton,
  createStorytellerVoiceSelector,
} from "./components/storyteller";

import { globals, isEndOfGame } from "./globals";
import {
  createSecretSequenceComponent,
  updateSecretSequenceComponent,
} from "./components/secret-sequence";
import { createConfigTools } from "./components/config-tools";
import { createScoreboard, updateHighScore } from "./components/score";

let storytellerButton;

function initGameData() {
  globals.emojiSet = shuffleArray(splitEmojis(animals)).slice(0, globals.level);
  globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
  globals.correctMatches = globals.emojiSet.map(() => false);
}

function init() {
  initGameData();

  document.body.appendChild(createSecretSequenceComponent());

  storytellerButton = createStorytellerButton();
  document.body.appendChild(storytellerButton);

  createStorytellerVoiceSelector().then((element) => {
    document.body.appendChild(element);
  });

  document.body.appendChild(
    initEmojiButtonField(globals.emojiSet, afterEmojiButtonClick)
  );

  document.body.appendChild(createConfigTools());
  document.body.appendChild(createScoreboard());
}

function afterEmojiButtonClick() {
  updateSecretSequenceComponent();
  if (isEndOfGame()) {
    endOfGame();
  }
}

function endOfGame() {
  let correctCount = globals.shuffledEmojis.length;
  for (let i = 0; i < globals.shuffledEmojis.length; i++) {
    if (!globals.correctMatches[i]) {
      buttonMap[globals.shuffledEmojis[i]].classList.add("wrong");
      correctCount--;
    }
  }
  storytellerButton.innerHTML = "Play again";
  updateHighScore();
}

// INIT
init();
