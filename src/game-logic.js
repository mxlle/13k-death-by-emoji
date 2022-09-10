import { getEmojiPool, globals, resetGlobals } from "./globals";
import { getCurrentVoice } from "./components/config-tools/voice-config";
import { speak } from "./speech/speech";
import { getRandomItem } from "./utils/array-utils";
import { shuffleArray } from "./utils/random-utils";
import { splitEmojis } from "./emojis/emoji-util";
import { waitForPromiseAndTime } from "./utils/promise-utils";
import { pubSubService, PubSubEvent } from "./utils/pub-sub-service";

const CHANGE_RATE_INTERVAL = 10;

const DEFAULT_WAIT_TIME = 1200;
const MAX_RATE = 2; // higher seems not supported in Chrome (todo double-check other browsers?)
const CHANGE_RATE_STEP = 0.1;
const CHANGE_WAIT_TIME_STEP = 100;

let waitTime = DEFAULT_WAIT_TIME;
let rate = 1;

const BASE_SCORE_MULTIPLIER = 10;
export const ScoreAction = {
  CORRECT: "correct",
  WRONG: "wrong",
};

export function newGame(optionalEmojiPool) {
  document.body.classList.remove("game-over");
  resetGlobals();
  initGameData(optionalEmojiPool);
  waitTime = DEFAULT_WAIT_TIME;
  rate = 1;
  pubSubService.publish(PubSubEvent.NEW_GAME);
}

export function initGameData(optionalEmojiPool) {
  const emojiPool = optionalEmojiPool || getEmojiPool();
  globals.emojiSet = shuffleArray(splitEmojis(emojiPool)).slice(
    0,
    globals.level
  );

  if (globals.practiceMode) {
    globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
    globals.correctMatches = globals.emojiSet.map(() => false);
  }
}

export async function playPracticeSequence(onNextEmoji) {
  for (let i = globals.clickCounter; i < globals.shuffledEmojis.length; i++) {
    const text = globals.shuffledEmojis[i];
    globals.currentIndex = i;

    if (onNextEmoji) onNextEmoji();

    await waitForPromiseAndTime(speakWithVoice(text, rate), waitTime);
  }

  increaseRate();
}

export async function playInfiniteSequence(onNextEmoji) {
  while (globals.queue.length < globals.slots) {
    const text = getRandomItem(globals.emojiSet);
    globals.queue.push(text);
    globals.currentIndex++;

    if (globals.currentIndex % CHANGE_RATE_INTERVAL === 0) {
      increaseRate();
    }

    if (onNextEmoji) onNextEmoji();

    await waitForPromiseAndTime(speakWithVoice(text, rate), waitTime);
  }

  globals.endOfGame = true;
  document.body.classList.add("game-over");
  pubSubService.publish(PubSubEvent.GAME_OVER);
}

export function evaluatePlay(emoji) {
  const correct = getWantedEmoji() === emoji; // || true;

  if (correct) {
    globals.correctCount++;
  } else {
    globals.slots--;
    globals.mistakes++;
  }

  if (globals.practiceMode) {
    globals.correctMatches[globals.clickCounter] = correct;
    globals.clickCounter++;
  }

  globals.streak = correct ? globals.streak + 1 : 1;

  const scoreForAction = getScoreForAction(
    correct ? ScoreAction.CORRECT : ScoreAction.WRONG
  );

  return { correct, scoreForAction };
}

export function getComboMultiplier(streak) {
  return Math.floor(Math.sqrt(Math.max(streak, 1)));
}

function getScoreForAction(action) {
  const comboMultiplier = getComboMultiplier(globals.streak);
  return getPointsByAction(action) * comboMultiplier;
}

export function getPointsByAction(action, level) {
  let points = 0,
    modifier = 1;

  level = level || globals.level;

  switch (action) {
    case ScoreAction.CORRECT:
      points = level;
      modifier = getConfigScoreModifier(true);
      break;
    case ScoreAction.WRONG:
      points = -1 * level;
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
  if (!globals.blindMode && !positive) {
    modifier *= 2;
  }
  if (globals.rainbowMode) {
    modifier *= 2;
  }

  return modifier;
}

function getWantedEmoji() {
  return globals.practiceMode
    ? globals.shuffledEmojis[globals.clickCounter]
    : globals.queue.shift();
}

async function speakWithVoice(text, rate) {
  const voice = getCurrentVoice();
  await speak(text, voice, rate);
}

function increaseRate() {
  rate += CHANGE_RATE_STEP;
  rate = Math.min(rate, MAX_RATE);
  waitTime -= CHANGE_WAIT_TIME_STEP;
  waitTime = Math.max(waitTime, DEFAULT_WAIT_TIME / MAX_RATE);
}
