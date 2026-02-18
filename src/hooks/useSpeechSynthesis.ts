import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const updateVoices = () => {
                const vs = window.speechSynthesis.getVoices();
                setVoices(vs);
            };

            window.speechSynthesis.onvoiceschanged = updateVoices;
            updateVoices(); // Initial check

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speak = useCallback((text: string, onEnd?: () => void) => {
        if (!supported) return;

        window.speechSynthesis.cancel();

        // Recursively retry if voices are not loaded yet (max 3 retries)
        const trySpeak = (retries = 3) => {
            const currentVoices = window.speechSynthesis.getVoices();

            if (currentVoices.length === 0 && retries > 0) {
                console.log("Voices not loaded yet, retrying...", retries);
                setTimeout(() => trySpeak(retries - 1), 500);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.rate = 1.0;
            utterance.pitch = 1;

            // Smart voice selection
            const trVoices = currentVoices.filter(v => v.lang.includes('tr') || v.lang.includes('TK'));
            // Prioritize Google, then Microsoft, then others
            const preferredVoice = trVoices.find(v => v.name.includes('Google')) ||
                trVoices.find(v => v.name.includes('Yelda')) ||
                trVoices[0];

            if (preferredVoice) {
                utterance.voice = preferredVoice;
                // console.log("Using voice:", preferredVoice.name);
            }

            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => {
                setSpeaking(false);
                if (onEnd) onEnd();
            };
            utterance.onerror = (e) => {
                console.error('Speech synthesis error:', e);
                setSpeaking(false);
                // Even on error, we might want to trigger onEnd to continue flow?
                if (onEnd) onEnd();
            };

            window.speechSynthesis.speak(utterance);
        };

        trySpeak();
    }, [supported]);

    const cancel = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [supported]);

    return { speak, cancel, speaking, supported, voices };
};
