import { globals, isGameActive } from "../../globals";
import { createElement } from "../../utils/html-utils";

import "./secret-sequence.scss";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

let domElement;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  updateSecretSequenceComponent();
});

export function createSecretSequenceComponent() {
  domElement = createElement({
    cssClass: "sequence",
  });
  updateSecretSequenceComponent();

  return domElement;
}

export function updateSecretSequenceComponent() {
  domElement.innerHTML = "";
  const kids = globals.practiceMode
    ? getSolutionText()
    : getSolutionTextInfinite();
  for (let kid of kids) {
    domElement.appendChild(kid);
  }
}

function getSolutionText() {
  const textParts = [];
  for (let i = 0; i < globals.shuffledEmojis.length; i++) {
    const hasNotHeardYet =
      globals.playCounter === 0 ||
      (globals.playCounter === 1 && i > globals.currentIndex);
    const showCurrentEmoji =
      globals.correctMatches[i] ||
      (isGameActive() &&
        globals.isSpeaking &&
        !globals.blindMode &&
        i === globals.currentIndex);
    textParts.push(
      hasNotHeardYet
        ? "_"
        : showCurrentEmoji
        ? globals.shuffledEmojis[i]
        : i < globals.clickCounter
        ? "❌"
        : i === globals.currentIndex && globals.isSpeaking
        ? "❓"
        : "❔"
    );
  }

  return textParts.map(mapToElement);
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
      textParts.push(globals.blindMode ? "❓" : globals.queue[i]);
    } else {
      textParts.push("❔");
    }
  }

  for (let j = globals.queue.length; j < globals.slots; j++) {
    textParts.push("_");
  }

  textParts.push("☠️");

  return textParts.map(mapToElement);
}

function mapToElement(text) {
  return createElement({
    cssClass: "rbc",
    text,
  });
}
