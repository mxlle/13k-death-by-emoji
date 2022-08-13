import {createElement} from "../utils/html-utils";
import {randomInt} from "../utils/random-utils";
import {getLocalStorageItem, LocalStorageKey, setLocalStorageItem} from "../utils/local-storage";

const synth = window.speechSynthesis;

export function getAvailableVoices() {
    return new Promise((resolve) => {
        synth.onvoiceschanged = () => {
            resolve(synth.getVoices());
        }
    });
}

export function speak(text, voice) {
    const utterThis = new SpeechSynthesisUtterance(text);
    if (voice) utterThis.voice = voice;
    synth.speak(utterThis);

    return new Promise(resolve => {
        const id = setInterval(() => {
            if (synth.speaking === false) {
                clearInterval(id);
                resolve();
            }
        }, 100);
    });
}

export function getVoiceListElement(voices, addRandom) {
    const voiceSelect = createElement({tag: 'select'});

    const savedVoice = getLocalStorageItem(LocalStorageKey.VOICE);

    if (addRandom) {
        let option = createElement({tag: 'option'});
        option.textContent = 'Random';
        option.setAttribute('data-lang', 'random');
        option.setAttribute('data-name', 'random');
        if (savedVoice === 'random') {
            option.setAttribute('selected', 'selected');
        }
        voiceSelect.appendChild(option);
    }

    for(let i = 0; i < voices.length ; i++) {
        let option = createElement({tag: 'option'});
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if(voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        if (savedVoice === voices[i].name) {
            option.setAttribute('selected', 'selected');
        }
        voiceSelect.appendChild(option);
    }

    voiceSelect.addEventListener('change', (_event) => {
        const selectedVoice = getSelectedVoice(voiceSelect, voices);
        setLocalStorageItem(LocalStorageKey.LANG, selectedVoice.lang);
        setLocalStorageItem(LocalStorageKey.VOICE, selectedVoice.name);
    })

    return voiceSelect;
}

export function getSelectedVoice(voiceSelect, voices) {
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

    if (selectedOption === 'random') {
        return voices[randomInt(voices.length)];
    }

    for (let i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            return voices[i];
        }
    }
}
