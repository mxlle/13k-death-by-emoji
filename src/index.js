import {createElement} from "./utils/html-utils";
import {getAvailableVoices, getSelectedVoice, getVoiceListElement, speak} from "./speech/speech";
import {death} from "./emojis/sets";
import {randomInt} from "./utils/random-utils";

import './index.scss';
import {splitEmojis} from "./emojis/emoji-util";

let speechBtn, voices, voiceListElement;

function init() {
    speechBtn = createElement({tag: 'button', text: '📢', onClick: () => speakEmoji()});
    document.body.appendChild(speechBtn);

    // speech
    getAvailableVoices().then((_voices) => {
        voices = _voices;
        voiceListElement = getVoiceListElement(voices, true);
        document.body.appendChild(voiceListElement);
    });
}

async function speakEmoji() {
    const emojiSet = splitEmojis(death);
    const text = emojiSet[randomInt(emojiSet.length)];
    const voice = voiceListElement && getSelectedVoice(voiceListElement, voices);
    const prevText = speechBtn.innerHTML;
    speechBtn.innerHTML = text;
    speechBtn.setAttribute('disabled', 'disabled');
    speechBtn.classList.add('activated');
    await speak(text, voice);
    speechBtn.classList.remove('activated');
    speechBtn.removeAttribute('disabled');
    speechBtn.innerHTML = prevText;
}

// INIT
init();
