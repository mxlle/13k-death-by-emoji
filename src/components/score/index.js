import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";

let scoreboard,
  highScore,
  highScoreCount,
  score = 0;

const BASE_SCORE_MULTIPLIER = 10;

export const ScoreAction = {
  CORRECT: "correct",
  WRONG: "wrong",
};

export function createScoreboard() {
  scoreboard = createElement({ cssClass: "scoreboard" });
  highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  highScore = highScore ? Number(highScore) : undefined;
  highScoreCount = getLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT);
  highScoreCount = highScoreCount ? Number(highScoreCount) : 0;
  updateScoreboard();
  return scoreboard;
}

export function updateScore(action) {
  const comboMultiplier = globals.streak;
  const scoreForAction = getPointsByAction(action) * comboMultiplier;
  score += scoreForAction;

  updateScoreboard();

  return scoreForAction;
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

export function getPointsByAction(action) {
  let points = 0,
    modifier = 1;
  switch (action) {
    case ScoreAction.CORRECT:
      points = globals.level;
      modifier = getConfigScoreModifier(true);
      break;
    case ScoreAction.WRONG:
      points = -1 * globals.level;
      modifier = getConfigScoreModifier();
      break;
  }

  return Math.round(points * modifier * BASE_SCORE_MULTIPLIER);
}

function getConfigScoreModifier(positive) {
  let modifier = 1;
  if (globals.blindMode) {
    modifier *= 3;
  }
  if (globals.mute) {
    modifier *= 1.5;
  }
  if (!globals.blindMode && !globals.mute && !positive) {
    modifier *= 2;
  }

  return modifier;
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
