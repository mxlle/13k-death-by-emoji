import { cuteAnimals1, flags, niceFlags } from "../../../emojis/sets";

export const gamePreconfigs = [
  {
    id: "1",
    icon: "🐣👁️",
    name: "Start here",
    config: {
      practiceMode: true,
      blindMode: false,
      level: 3,
    },
  },
  {
    id: "2",
    icon: "🐣🗣️",
    name: "Trust your ears",
    config: {
      practiceMode: true,
      blindMode: true,
      level: 6,
    },
  },
  {
    id: "3",
    icon: "☠️👁️",
    name: "Meet death",
    config: {
      practiceMode: false,
      blindMode: false,
      level: 6,
    },
  },
  {
    id: "4",
    icon: "☠️🗣️",
    name: "Deathly blind",
    config: {
      practiceMode: false,
      blindMode: true,
      level: 12,
    },
  },
  {
    id: "5",
    icon: "🌐",
    //: "Go international",
    name: "[Coming soon]",
    disabled: true,
    randomLanguage: true, // TODO - implement
    config: {
      practiceMode: false,
      blindMode: false,
      level: 6,
    },
  },
  {
    id: "6",
    icon: niceFlags,
    name: "Fun with flags",
    emojiPool: flags,
    emojiPoolName: "Flags",
    config: {
      practiceMode: true,
      blindMode: false,
      level: 12,
    },
  },
  {
    id: "7",
    icon: "🐶🐰🐥",
    name: "Cuteness overload",
    emojiPool: cuteAnimals1,
    config: {
      practiceMode: false,
      blindMode: false,
      level: 12,
    },
  },
  {
    id: "8",
    icon: "🎁",
    name: "Surprise me",
    surpriseMe: true,
  },
];
