import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setGameHighCount,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";

let scoreboard,
  highScore,
  highScoreCount,
  score = 0;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  init();
});

function init() {
  score = 0;
  highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  highScore = highScore ? Number(highScore) : undefined;
  highScoreCount = getLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT);
  highScoreCount = highScoreCount ? Number(highScoreCount) : 0;
  updateScoreboard();
}

export function createScoreboard() {
  scoreboard = createElement({ cssClass: "scoreboard" });
  init();
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

  setGameHighCount(
    getLocalStorageItem(LocalStorageKey.CURRENT_GAME),
    globals.correctCount
  );
}

function updateScoreboard() {
  let text = getSimpleCount();
  if (!globals.practiceMode) {
    text += "&nbsp;&nbsp;&nbsp;" + getSimpleScore();
    if (highScore) {
      text += `&nbsp;&nbsp;&nbsp;(🥇 ${highScoreCount} / ${highScore})`;
    }
  }
  scoreboard.innerHTML = text;
}

function getSimpleScore() {
  return "🏆 " + score;
}

function getSimpleCount() {
  let countText = "✅ " + globals.correctCount;
  if (globals.practiceMode) {
    countText += "/" + globals.shuffledEmojis.length;
  }

  return countText;
}

export function getScore() {
  return score;
}

export function getScoreAndHighScoreText() {
  return `Your score: ${getSimpleScore()}  🥇 High score: ${highScore}`;
}

export function getResultAndRecordText() {
  let resultText = `Your result: ${getSimpleCount()}`;
  if (!globals.practiceMode) {
    resultText += `  🥇 Record: ${highScoreCount}`;
  }
  return resultText;
}
