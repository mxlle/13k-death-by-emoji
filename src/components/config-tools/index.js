import {
  appendRainbowCapableText,
  createElement,
} from "../../utils/html-utils";

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
  appendRainbowCapableText(homeButton, "🏠");

  const configButton = createElement({
    tag: "button",
    cssClass: "icon-btn",
    onClick: () => showConfigScreen(),
  });
  appendRainbowCapableText(configButton, "⚙️");

  configTools.appendChild(homeButton);
  configTools.appendChild(configButton);

  return configTools;
}
