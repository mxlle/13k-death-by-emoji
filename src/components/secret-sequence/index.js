import { globals } from "../../globals";
import { createElement } from "../../utils/html-utils";

import "./secret-sequence.scss";

let domElement;

export function createSecretSequenceComponent() {
  domElement = createElement({
    cssClass: "secret-sequence",
    text: getSolutionText(),
  });
  return domElement;
}

export function updateSecretSequenceComponent() {
  domElement.innerHTML = getSolutionText();
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
