import { createButton, createElement } from "../../utils/html-utils";

import "./config-tools.scss";
import { openNewGameScreen } from "../new-game-screen";
import { showConfigScreen } from "./config-screen";

export function createConfigTools() {
  const configTools = createElement({ cssClass: "config-tools" });

  const homeButton = createButton({
    iconBtn: true,
    text: "🏠",
    rbc: true,
    onClick: () => openNewGameScreen(),
  });

  const configButton = createButton({
    iconBtn: true,
    text: "⚙️",
    rbc: true,
    onClick: () => showConfigScreen(),
  });

  configTools.appendChild(homeButton);
  configTools.appendChild(configButton);

  return configTools;
}
