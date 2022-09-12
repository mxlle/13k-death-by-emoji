import { createElement } from "../../utils/html-utils";

import "./stars.scss";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

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
