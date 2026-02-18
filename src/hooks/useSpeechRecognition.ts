import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [supported, setSupported] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    const silenceTimerRef = useRef<any>(null);

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition)
        ) {
            setSupported(true);
        }
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, []);

    const startListening = useCallback(() => {
        if (!supported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = true; // CHANGED: Keep listening
        recognition.interimResults = true;

        recognitionRef.current = recognition;

        setTranscript('');
        setFinalTranscript('');
        setListening(true);

        const resetSilenceTimer = () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

            // Wait 2 seconds of silence before stopping
            silenceTimerRef.current = setTimeout(() => {
                console.log("Silence detected (2s), stopping...");
                recognition.stop();
            }, 2000);
        };

        recognition.onstart = () => {
            console.log("Speech recognition started");
            setListening(true);
            setError(null);
            resetSilenceTimer(); // Start timer initially
        };

        recognition.onresult = (event: any) => {
            resetSilenceTimer(); // Reset timer on any speech

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
                // If we get a final result, we update but DON'T stop immediately
                // We let the silence timer handle the stop
                setFinalTranscript(prev => prev + " " + final); // Append if multiple segments
            }
        };

        recognition.onspeechend = () => {
            // In continuous mode, this might not fire until we stop, or it fires on pause
            // We rely more on silence timer, but if browser forces end:
            console.log("Speech end detected by browser");
        };

        recognition.onend = () => {
            console.log("Speech recognition ended (session end)");
            setListening(false);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            // Ignore 'no-speech' errors if we want to keep trying, or handle gracefully
            if (event.error !== 'no-speech') {
                setError(event.error);
            }
            // recognition.stop(); // Don't always stop on error?
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
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            // setListening(false); // onend will handle this
        }
    }, []);

    return {
        listening,
        transcript,
        finalTranscript,
        startListening,
        stopListening,
        supported,
        error,
    };
};
