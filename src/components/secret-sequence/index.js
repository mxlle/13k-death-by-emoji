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

export function updateSecretSequenceComponent(showIndex) {
  domElement.innerHTML = getSolutionText(showIndex);
}

function getSolutionText(showIndex) {
  const textParts = [];
  for (let i = 0; i < globals.shuffledEmojis.length; i++) {
    textParts.push(
      globals.correctMatches[i] || i === showIndex
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
