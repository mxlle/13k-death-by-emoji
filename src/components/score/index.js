import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

let scoreboard,
  highScore,
  highScoreCount,
  score = 0;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  updateScoreboard();
});

export function createScoreboard() {
  scoreboard = createElement({ cssClass: "scoreboard" });
  highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  highScore = highScore ? Number(highScore) : undefined;
  highScoreCount = getLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT);
  highScoreCount = highScoreCount ? Number(highScoreCount) : 0;
  updateScoreboard();
  return scoreboard;
}

export function updateScore(scoreForAction) {
  score += scoreForAction;
  updateScoreboard();
}

export function updateHighScore() {
  if (!highScore || highScore < score) {
    setLocalStorageItem(LocalStorageKey.HIGH_SCORE, score);
    highScore = score;
    updateScoreboard();
  }

  if (!highScoreCount || highScoreCount < globals.correctCount) {
    setLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT, globals.correctCount);
    highScoreCount = globals.correctCount;
    updateScoreboard();
  }
}

function updateScoreboard() {
  let text = "✅ " + globals.correctCount;
  if (globals.practiceMode) {
    text += "/" + globals.shuffledEmojis.length;
  } else {
    text += "&nbsp;&nbsp;&nbsp;🏆 " + score;
    if (highScore) {
      text += `&nbsp;&nbsp;&nbsp;(🥇 ${highScoreCount} / ${highScore})`;
    }
  }
  scoreboard.innerHTML = text;
}
