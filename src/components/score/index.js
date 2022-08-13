import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

let scoreboard,
  highScore,
  score = 0;

export const ScoreAction = {
  CORRECT: "correct",
  WRONG: "wrong",
  REPLAY: "replay",
};

export function createScoreboard() {
  scoreboard = createElement({ cssClass: "scoreboard" });
  highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  highScore = highScore ? Number(highScore) : undefined;
  updateScoreboard();
  return scoreboard;
}

export function updateScore(action) {
  score += getPointsByAction(action);

  updateScoreboard();
}

export function updateHighScore() {
  if (!highScore || highScore < score) {
    setLocalStorageItem(LocalStorageKey.HIGH_SCORE, score);
    highScore = score;
    updateScoreboard();
  }
}

export function getPointsByAction(action) {
  let points = 0,
    modifier = 1;
  switch (action) {
    case ScoreAction.CORRECT:
      points = globals.level;
      modifier = getPointModifier(true);
      break;
    case ScoreAction.WRONG:
      points = -1 * globals.level;
      modifier = getPointModifier();
      break;
    case ScoreAction.REPLAY:
      points = -3 * globals.level;
      modifier = getPointModifier();
      break;
  }

  return Math.round(points * modifier);
}

function getPointModifier(positive) {
  if (globals.mute && globals.blindMode) {
    return positive ? 10 : 0.1;
  }
  if (globals.mute) {
    return positive ? 1.2 : 1;
  }
  if (globals.blindMode) {
    return positive ? 2 : 0.9;
  }

  return 1;
}

function updateScoreboard() {
  let text = "🏆 " + score;
  if (highScore) {
    text += `&nbsp;&nbsp;&nbsp;(🥇 ${highScore})`;
  }
  scoreboard.innerHTML = text;
}
