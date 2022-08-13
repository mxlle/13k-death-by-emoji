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

let storytellerButton;

function initGameData(level) {
  globals.emojiSet = shuffleArray(splitEmojis(animals)).slice(0, level ?? 3);
  globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
  globals.correctMatches = globals.emojiSet.map(() => false);
}

function init() {
  initGameData(10);

  document.body.appendChild(createSecretSequenceComponent());

  storytellerButton = createStorytellerButton();
  document.body.appendChild(storytellerButton);

  createStorytellerVoiceSelector().then((element) => {
    document.body.appendChild(element);
  });

  document.body.appendChild(
    initEmojiButtonField(globals.emojiSet, afterEmojiButtonClick)
  );
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
  storytellerButton.innerHTML =
    Math.round((correctCount / globals.shuffledEmojis.length) * 100) + "%";
}

// INIT
init();
