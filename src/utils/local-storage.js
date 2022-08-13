const LOCAL_STORAGE_PREFIX = '☠️👻🔫';

export const LocalStorageKey = {
    'LANG': 'selectedLanguage',
    'VOICE': 'selectedVoice'
}

export function setLocalStorageItem(key, value) {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + '.' + key, value);
}

export function getLocalStorageItem(key) {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + '.' + key);
}
