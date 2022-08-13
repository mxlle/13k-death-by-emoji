import { createElement } from "./utils/html-utils";
import {
  getAvailableVoices,
  getSelectedVoice,
  getVoiceListElement,
  speak,
} from "./speech/speech";
import { animals } from "./emojis/sets";
import { shuffleArray } from "./utils/random-utils";

import "./index.scss";
import { splitEmojis } from "./emojis/emoji-util";
import { buttonMap, initEmojiButtonField } from "./components/emoji-buttons";

let speechBtn,
  voices,
  voiceListElement,
  solution,
  clickCounter = 0;

let emojiSet;
let shuffledEmojis;
let correctMatches;

function initGameData(level) {
  emojiSet = shuffleArray(splitEmojis(animals)).slice(0, level ?? 3);
  shuffledEmojis = shuffleArray([...emojiSet]);
  correctMatches = emojiSet.map(() => false);
}

function init() {
  initGameData(10);

  solution = createElement({ cssClass: "solution", text: getSolutionText() });
  document.body.appendChild(solution);

  speechBtn = createElement({
    tag: "button",
    text: "📢",
    cssClass: "speak-button",
    onClick: () => speakEmojis(),
  });
  document.body.appendChild(speechBtn);

  document.body.appendChild(
    createElement({
      tag: "button",
      text: "Reset",
      cssClass: "reset-button",
      onClick: () => window.location.reload(),
    })
  );

  // speech
  getAvailableVoices().then((_voices) => {
    voices = _voices;
    voiceListElement = getVoiceListElement(voices, true);
    document.body.appendChild(voiceListElement);
  });

  const buttonField = initEmojiButtonField(emojiSet, onEmojiClick);
  document.body.appendChild(buttonField);
}

function onEmojiClick(emoji, emojiButton) {
  const correct = shuffledEmojis[clickCounter] === emoji;
  emojiButton.classList.add(correct ? "correct" : "wrong");
  setTimeout(() => {
    emojiButton.classList.remove("wrong");
  }, 500);
  correctMatches[clickCounter] = correct;
  clickCounter++;
  solution.innerHTML = getSolutionText();
  if (isEndOfGame()) {
    endOfGame();
  }
}

async function speakEmojis() {
  const prevText = speechBtn.innerHTML;
  speechBtn.setAttribute("disabled", "disabled");
  speechBtn.classList.add("activated");
  for (const text of shuffledEmojis) {
    speechBtn.innerHTML = text;
    await speakWithVoice(text);
  }
  speechBtn.classList.remove("activated");
  if (!isEndOfGame()) {
    speechBtn.removeAttribute("disabled");
    speechBtn.innerHTML = prevText;
  }
}

async function speakWithVoice(text) {
  const voice = voiceListElement && getSelectedVoice(voiceListElement, voices);
  await speak(text, voice);
}

function getSolutionText() {
  const textParts = [];
  for (let i = 0; i < shuffledEmojis.length; i++) {
    textParts.push(
      correctMatches[i] ? shuffledEmojis[i] : i < clickCounter ? "❌" : "❓"
    );
  }
  return textParts.join(" ");
}

function isEndOfGame() {
  return clickCounter >= emojiSet.length;
}

function endOfGame() {
  let correctCount = shuffledEmojis.length;
  for (let i = 0; i < shuffledEmojis.length; i++) {
    if (!correctMatches[i]) {
      buttonMap[shuffledEmojis[i]].classList.add("wrong");
      correctCount--;
    }
  }
  speechBtn.innerHTML =
    Math.round((correctCount / shuffledEmojis.length) * 100) + "%";
  speechBtn.setAttribute("disabled", "disabled");
}

// INIT
init();
