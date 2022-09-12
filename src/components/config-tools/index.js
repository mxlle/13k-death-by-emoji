import { createButton, createElement } from "../../utils/html-utils";

import "./config-tools.scss";
import { openNewGameScreen } from "../new-game-screen";
import { showConfigScreen } from "./config-screen";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { getDefaultLanguage } from "../../utils/language-util";
import { globals } from "../../globals";

export function createConfigTools() {
  const configTools = createElement({ cssClass: "tools" });

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

  const languageInfo = createElement({ cssClass: "info" });
  function updateLanguageInfo() {
    languageInfo.innerText =
      globals.currentLanguage === getDefaultLanguage()
        ? ""
        : `[${globals.currentLanguage}]`;
  }
  pubSubService.subscribe(PubSubEvent.NEW_GAME, updateLanguageInfo);

  configTools.appendChild(homeButton);
  configTools.appendChild(configButton);
  configTools.appendChild(languageInfo);

  return configTools;
}
