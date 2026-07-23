export const getMaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined') return null;
    
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Common male voice names across different OS/Browsers
    const maleNames = ['daniel', 'david', 'mark', 'arthur', 'google uk english male', 'alex', 'fred', 'james'];
    
    // 1. Try to find a known male voice
    for (const name of maleNames) {
        const found = voices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
    }

    // 2. If no explicit male name found, try to find an english voice that is generally deeper
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length > 0) {
        // Fallback to the last english voice (sometimes non-default voices are male, but it's a guess)
        return englishVoices[englishVoices.length - 1];
    }

    return voices[0]; // Absolute fallback
};
