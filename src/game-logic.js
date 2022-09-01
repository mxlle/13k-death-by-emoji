import { getEmojiPool, globals } from "./globals";
import { getCurrentVoice } from "./components/config-tools/voice-config";
import { speak } from "./speech/speech";
import { getRandomItem } from "./utils/array-utils";
import { shuffleArray } from "./utils/random-utils";
import { splitEmojis } from "./emojis/emoji-util";

const BASE_SCORE_MULTIPLIER = 10;
export const ScoreAction = {
  CORRECT: "correct",
  WRONG: "wrong",
};

export function initGameData() {
  globals.emojiSet = shuffleArray(splitEmojis(getEmojiPool())).slice(
    0,
    globals.level
  );

  if (globals.practiceMode) {
    globals.shuffledEmojis = shuffleArray([...globals.emojiSet]);
    globals.correctMatches = globals.emojiSet.map(() => false);
  }
}

export async function playPracticeSequence(onNextEmoji) {
  globals.started = true;
  globals.isSpeaking = true;

  for (let i = globals.clickCounter; i < globals.shuffledEmojis.length; i++) {
    const text = globals.shuffledEmojis[i];
    globals.currentIndex = i;

    if (onNextEmoji) onNextEmoji();

    await speakWithVoice(text);
  }

  globals.isSpeaking = false;
}

export async function playInfiniteSequence(onNextEmoji) {
  globals.started = true;
  globals.isSpeaking = true;

  while (globals.queue.length < globals.slots) {
    const text = getRandomItem(globals.emojiSet);
    globals.queue.push(text);

    if (onNextEmoji) onNextEmoji();

    await speakWithVoice(text);
  }

  globals.isSpeaking = false;
  globals.endOfGame = true;
  document.body.classList.add("end-of-game");
}

export function evaluatePlay(emoji) {
  const correct = getWantedEmoji() === emoji;

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

function getScoreForAction(action) {
  const comboMultiplier = globals.streak;
  return getPointsByAction(action) * comboMultiplier;
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

function getWantedEmoji() {
  return globals.practiceMode
    ? globals.shuffledEmojis[globals.clickCounter]
    : globals.queue.shift();
}

async function speakWithVoice(text) {
  const voice = getCurrentVoice();
  await speak(text, voice);
}
