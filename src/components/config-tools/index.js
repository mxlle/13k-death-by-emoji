import { appendEmoji, createElement } from "../../utils/html-utils";

import "./config-tools.scss";
import { openNewGameScreen } from "../new-game-screen";
import { showConfigScreen } from "./config-screen";

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  const homeButton = createElement({
    tag: "button",
    cssClass: "icon-btn",
    onClick: () => openNewGameScreen(),
  });
  appendEmoji(homeButton, "🏠");

  const configButton = createElement({
    tag: "button",
    cssClass: "icon-btn",
    onClick: () => showConfigScreen(),
  });
  appendEmoji(configButton, "⚙️");

  configTools.appendChild(homeButton);
  configTools.appendChild(configButton);

  return configTools;
}
