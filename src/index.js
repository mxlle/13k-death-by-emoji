import { createElement } from "./utils/html-utils";
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

let storytellerButton;

function initGameData(level) {
  globals.emojiSet = shuffleArray(splitEmojis(animals)).slice(0, level ?? 3);
  globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
  globals.correctMatches = globals.emojiSet.map(() => false);
}

function init() {
  initGameData(10);

  globals.solution = createElement({
    cssClass: "solution",
    text: getSolutionText(),
  });
  document.body.appendChild(globals.solution);

  storytellerButton = createStorytellerButton();
  document.body.appendChild(storytellerButton);

  document.body.appendChild(
    createElement({
      tag: "button",
      text: "Reset",
      cssClass: "reset-button",
      onClick: () => window.location.reload(),
    })
  );

  createStorytellerVoiceSelector().then((element) => {
    document.body.appendChild(element);
  });

  const buttonField = initEmojiButtonField(globals.emojiSet, onEmojiClick);
  document.body.appendChild(buttonField);
}

function onEmojiClick(emoji, emojiButton) {
  const correct = globals.shuffledEmojis[globals.clickCounter] === emoji;
  emojiButton.classList.add(correct ? "correct" : "wrong");
  setTimeout(() => {
    emojiButton.classList.remove("wrong");
  }, 500);
  globals.correctMatches[globals.clickCounter] = correct;
  globals.clickCounter++;
  globals.solution.innerHTML = getSolutionText();
  if (isEndOfGame()) {
    endOfGame();
  }
}

function getSolutionText() {
  const textParts = [];
  for (let i = 0; i < globals.shuffledEmojis.length; i++) {
    textParts.push(
      globals.correctMatches[i]
        ? globals.shuffledEmojis[i]
        : i < globals.clickCounter
        ? "❌"
        : "❓"
    );
  }
  return textParts.join(" ");
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
  storytellerButton.setAttribute("disabled", "disabled");
}

// INIT
init();
