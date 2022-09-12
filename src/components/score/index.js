import { createElement } from "../../utils/html-utils";
import { globals } from "../../globals";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setGameHighCount,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { getGameCountToSave } from "../../game-logic";

let scoreboard,
  score = 0;

pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
  init();
});

function init() {
  score = 0;
  updateScoreboard();
}

export function createScoreboard() {
  scoreboard = createElement({});
  init();
  return scoreboard;
}

export function updateScore(scoreForAction) {
  score += scoreForAction;
  updateScoreboard();
}

export function updateHighScore() {
  const highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  const highScoreCount = getLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT);

  if (!highScore || highScore < score) {
    setLocalStorageItem(LocalStorageKey.HIGH_SCORE, score);
  }

  if (!highScoreCount || highScoreCount < globals.correctCount) {
    setLocalStorageItem(LocalStorageKey.HIGH_SCORE_COUNT, globals.correctCount);
  }

  setGameHighCount(
    getLocalStorageItem(LocalStorageKey.CURRENT_GAME),
    getGameCountToSave()
  );
}

function updateScoreboard() {
  let text = getSimpleCount();
  if (!globals.practiceMode) {
    text += "&nbsp;&nbsp;&nbsp;" + getSimpleScore();
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
  const highScore = getLocalStorageItem(LocalStorageKey.HIGH_SCORE);
  return `Your score: ${getSimpleScore()}  🥇 High score: ${highScore}`;
}

export function getResultAndRecordText() {
  let resultText = `Your result: ${getSimpleCount()}`;
  if (!globals.practiceMode) {
    const highScoreCount = getLocalStorageItem(
      LocalStorageKey.HIGH_SCORE_COUNT
    );
    resultText += `  🥇 Record: ${highScoreCount}`;
  }
  return resultText;
}
