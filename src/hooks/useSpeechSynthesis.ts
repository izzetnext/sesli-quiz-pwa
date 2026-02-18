import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
        }
    }, []);

    const speak = useCallback((text: string, onEnd?: () => void) => {
        if (!supported) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Try to find a Turkish voice
        const voices = window.speechSynthesis.getVoices();
        const turkishVoice = voices.find((v) => v.lang === 'tr-TR');
        if (turkishVoice) {
            utterance.voice = turkishVoice;
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
            setSpeaking(false);
            if (onEnd) onEnd();
        };
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            setSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const cancel = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [supported]);

    return { speak, cancel, speaking, supported };
};
