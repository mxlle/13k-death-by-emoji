import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import { createSecretSequenceComponent } from "../secret-sequence";
import { createStorytellerButton } from "../storyteller";
import { initEmojiButtonField } from "../emoji-buttons";

import "./game-field.scss";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  createGameField();
});

const gameField = createElement({ cssClass: "game-field" });

export function createGameField() {
  gameField.innerHTML = "";

  gameField.appendChild(createInfo());

  gameField.appendChild(createSecretSequenceComponent());

  gameField.appendChild(createStorytellerButton());

  gameField.appendChild(initEmojiButtonField(globals.emojiSet));

  return gameField;
}

function createInfo() {
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

  return info;
}
