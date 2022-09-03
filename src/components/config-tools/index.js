import { createElement } from "../../utils/html-utils";
import { globals, isEndOfGame } from "../../globals";

import "./config-tools.scss";
import { getPointsByAction, ScoreAction } from "../../game-logic";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { showConfigScreen } from "./config-screen";

let scoreModifiers;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  updateScoreModifiers();
});

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  configTools.appendChild(
    createElement({
      tag: "button",
      cssClass: "emoji icon-button",
      text: "⚙️",
      onClick: () => showConfigScreen(),
    })
  );

  scoreModifiers = createElement({ cssClass: "score-modifiers" });
  configTools.appendChild(scoreModifiers);
  updateScoreModifiers();

  return configTools;
}

export function updateScoreModifiers() {
  if (globals.practiceMode) {
    scoreModifiers.innerHTML = "";
  } else {
    if (isEndOfGame()) return;
    const combo = globals.streak > 1 ? `&nbsp; Combo: x${globals.streak}` : "";
    scoreModifiers.innerHTML = `&nbsp;✅: +${getPointsByAction(
      ScoreAction.CORRECT
    )}&nbsp; ❌: ${getPointsByAction(ScoreAction.WRONG)}${combo}`;
  }
}
