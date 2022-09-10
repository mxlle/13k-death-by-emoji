import { createElement } from "../../utils/html-utils";

import "./config-tools.scss";
import { openNewGameScreen } from "../new-game-screen";
import { showConfigScreen } from "./config-screen";

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  configTools.appendChild(
    createElement({
      tag: "button",
      cssClass: "emoji icon-button",
      text: "🏠",
      onClick: () => openNewGameScreen(),
    })
  );

  configTools.appendChild(
    createElement({
      tag: "button",
      cssClass: "emoji icon-button",
      text: "⚙️",
      onClick: () => showConfigScreen(),
    })
  );

  return configTools;
}
