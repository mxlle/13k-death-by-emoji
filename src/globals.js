export const globals = {
  solution: undefined,
  clickCounter: 0,
  emojiSet: [],
  shuffledEmojis: [],
  correctMatches: [],
  blindMode: true,
};

export function isEndOfGame() {
  return globals.clickCounter >= globals.emojiSet.length;
}
