import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [supported, setSupported] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition)
        ) {
            setSupported(true);
        }
    }, []);

    const startListening = useCallback(() => {
        if (!supported) return;

        // Re-initialize to ensure fresh state or handle if stopped
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognitionRef.current = recognition;

        setTranscript('');
        setFinalTranscript('');
        setListening(true);

        recognition.onstart = () => {
            console.log("Speech recognition started");
            setListening(true);
            setError(null);
        };

        recognition.onresult = (event: any) => {
            console.log("Speech recognition result received");
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (interim) setTranscript(interim);
            if (final) {
                setFinalTranscript(final);
                console.log("Final transcript:", final);
                // If final is received, we can theoretically stop, but onspeechend handles it
            }
        };

        recognition.onspeechend = () => {
            console.log("Speech recognition ended (speech end)");
            recognition.stop();
            setListening(false);
        };

        recognition.onend = () => {
            console.log("Speech recognition ended (session end)");
            setListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setListening(false);
        };

        try {
            recognition.start();
            console.log("Speech recognition start called");
        } catch (e) {
            console.error('Failed to start recognition', e);
            setListening(false);
        }
    }, [supported]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setListening(false);
        }
    }, []);

    return {
        listening,
        transcript,
        finalTranscript,
        startListening,
        stopListening,
        supported,
        error, // Export error
    };
};
