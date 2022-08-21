import { globals, isGameActive } from "../../globals";
import { createElement } from "../../utils/html-utils";

import "./secret-sequence.scss";

let domElement;

export function createSecretSequenceComponent() {
  domElement = createElement({
    cssClass: "secret-sequence",
  });
  updateSecretSequenceComponent();

  return domElement;
}

export function updateSecretSequenceComponent() {
  domElement.innerHTML = globals.practiceMode
    ? getSolutionText()
    : getSolutionTextInfinite();
}

function getSolutionText() {
  const textParts = [];
  for (let i = 0; i < globals.shuffledEmojis.length; i++) {
    textParts.push(
      globals.correctMatches[i] ||
        (isGameActive() &&
          globals.isSpeaking &&
          !globals.blindMode &&
          i === globals.currentIndex)
        ? globals.shuffledEmojis[i]
        : i < globals.clickCounter
        ? "❌"
        : i === globals.clickCounter
        ? "❔"
        : "❓"
    );
  }
  return textParts.join(" ");
}

function getSolutionTextInfinite() {
  const textParts = [];
  for (let i = 0; i < globals.mistakes; i++) {
    textParts.push("☠️");
  }

  for (let i = 0; i < globals.queue.length; i++) {
    if (globals.endOfGame) {
      textParts.push("☠️");
    } else if (i === globals.queue.length - 1) {
      textParts.push(globals.blindMode ? "❔" : globals.queue[i]);
    } else {
      textParts.push("❓");
    }
  }

  for (let j = globals.queue.length; j < globals.slots; j++) {
    textParts.push("_");
  }

  textParts.push("☠️");
  return textParts.join(" ");
}
