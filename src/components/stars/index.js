import { createElement } from "../../utils/html-utils";
import { getGameHighCount } from "../../utils/local-storage";

import "./stars.scss";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { globals } from "../../globals";
import { getGameCountToSave } from "../../game-logic";

const EMPTY_STAR = "☆";
export const FULL_STAR = "★";
const zeroClass = "zero";

export function createStarComponent(achievedStars) {
  const stars = createElement({
    cssClass: "stars",
  });

  for (let i = 0; i < 3; i++) {
    stars.appendChild(createElement({}));
  }
  updateStars(stars, achievedStars);

  return stars;
}

export function updateStars(stars, achievedStars) {
  stars.classList.toggle(zeroClass, achievedStars === 0);
  for (let i = 0; i < 3; i++) {
    stars.children[i].textContent = achievedStars > i ? FULL_STAR : EMPTY_STAR;
  }
}

export function getAchievedStars(id, isPractice, expected, achievedCount) {
  achievedCount = achievedCount ?? getGameHighCount(id);

  if (isPractice) {
    if (achievedCount > expected) {
      return 3;
    }
    if (achievedCount === expected) {
      return 2;
    }
    if (achievedCount >= expected / 2) {
      return 1;
    }
  } else {
    if (achievedCount >= 73) {
      return 3;
    }
    if (achievedCount >= 42) {
      return 2;
    }
    if (achievedCount >= 13) {
      return 1;
    }
  }

  return 0;
}

export function getCurrentAchievedStars() {
  return getAchievedStars(
    undefined,
    globals.practiceMode,
    globals.level,
    getGameCountToSave()
  );
}

export function getStarsForGameField() {
  const stars = createStarComponent(0);

  pubSubService.subscribe(PubSubEvent.STARS_CHANGED, (achievedStars) => {
    console.log("Star update", achievedStars);
    updateStars(stars, achievedStars);
    stars.classList.toggle("new-star", true);
    setTimeout(() => stars.classList.toggle("new-star", false), 300);
  });

  return stars;
}
