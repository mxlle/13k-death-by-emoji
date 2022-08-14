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

const BASE_SCORE_MULTIPLIER = 10;

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
  const comboMultiplier = action === ScoreAction.REPLAY ? 1 : globals.streak;
  score += getPointsByAction(action) * comboMultiplier;

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
      modifier = getConfigScoreModifier(true);
      break;
    case ScoreAction.WRONG:
      points = -1 * globals.level;
      modifier = getConfigScoreModifier();
      break;
    case ScoreAction.REPLAY:
      points =
        -1 *
        ((globals.shuffledEmojis.length - globals.clickCounter) *
          globals.replayCounter) *
        globals.level;
      modifier = getConfigScoreModifier();
      break;
  }

  return Math.round(points * modifier * BASE_SCORE_MULTIPLIER);
}

function getConfigScoreModifier(positive) {
  let modifier = 1;
  if (globals.blindMode) {
    modifier *= 2;
  }
  if (globals.mute) {
    modifier *= 1.5;
  }
  if (!globals.blindMode && !globals.mute && !positive) {
    modifier *= 2;
  }

  return modifier * globals.languageFactor;
}

function updateScoreboard() {
  let text = "🏆 " + score;
  if (highScore) {
    text += `&nbsp;&nbsp;&nbsp;(🥇 ${highScore})`;
  }
  scoreboard.innerHTML = text;
}
