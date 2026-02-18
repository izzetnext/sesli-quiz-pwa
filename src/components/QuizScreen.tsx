import { useEffect, useState, useRef } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { normalizeAnswer } from '../utils/normalize';
import { levenshteinDistance } from '../utils/levenshtein';
import { ProgressBar } from './ProgressBar';
import { MicIndicator } from './MicIndicator';
import { FeedbackOverlay } from './FeedbackOverlay';

export const QuizScreen = () => {
    const { state, dispatch } = useQuiz();
    const { quizData, currentQuestionIndex } = state;
    const currentQuestion = quizData?.questions[currentQuestionIndex];

    const { speak, cancel } = useSpeechSynthesis();
    const { startListening, stopListening, listening, transcript, finalTranscript, error } = useSpeechRecognition();

    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [showOverlay, setShowOverlay] = useState(false);

    // Use a ref to prevent double evaluation due to react strict mode or rapid updates
    const processedRef = useRef(false);

    // Helper to safely speak
    const speakText = (text: string, onEnd?: () => void) => {
        // Small delay to ensure previous speech is fully cancelled or state is settled
        setTimeout(() => {
            speak(text, onEnd);
        }, 100);
    };

    // 1. Reset state and start flow when question changes
    useEffect(() => {
        if (!currentQuestion) return;

        console.log("New question loaded:", currentQuestion.id);

        // Reset local state
        setFeedback('idle');
        setShowOverlay(false);
        processedRef.current = false;

        // Stop any previous activity
        cancel();
        stopListening();

        // Start with a small delay for better UX
        const timer = setTimeout(() => {
            console.log("Starting TTS for question");
            speakText(currentQuestion.question, () => {
                console.log("TTS finished, attempting to start STT");
                // Once speaking finishes, start listening
                // Only if we haven't processed (e.g. user didn't leave)
                if (!processedRef.current) {
                    startListening();
                }
            });
        }, 500);

        return () => {
            clearTimeout(timer);
            cancel();
            stopListening();
        };
    }, [currentQuestionIndex]); // Dependency on index implies new question

    // 2. Evaluate ONLY when listening stops (meaning silence timer fired or user manually stopped)
    useEffect(() => {
        // If we stopped listening and have a final transcript, evaluate it
        if (!listening && finalTranscript && !processedRef.current) {
            console.log("Listening stopped with transcript, evaluating...");
            evaluateAnswer(finalTranscript);
        }
    }, [listening, finalTranscript]);

    // Removed the previous useEffect that triggered on finalTranscript change
    // preventing premature evaluation.

    const evaluateAnswer = (text: string) => {
        if (!currentQuestion) return;

        // Trim and clean
        const cleanedText = text.trim();
        if (!cleanedText) return;

        stopListening(); // Stop mic immediately
        processedRef.current = true; // Mark as processed

        console.log("User said (Final):", cleanedText);
        const normalizedInput = normalizeAnswer(cleanedText);
        const normalizedAnswer = normalizeAnswer(currentQuestion.answer);

        console.log("Comp:", normalizedInput, "vs", normalizedAnswer);

        const distance = levenshteinDistance(normalizedInput, normalizedAnswer);
        // Allow max distance of 2 for fuzziness
        const isCorrect = normalizedInput === normalizedAnswer || distance <= 2;

        // Update UI
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        setShowOverlay(true);

        // Update Global State
        dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect } });

        // Provide Audio Feedback
        if (isCorrect) {
            speakText("Doğru!", () => {
                setTimeout(nextQuestion, 1000);
            });
        } else {
            speakText(`Yanlış. Doğru cevap: ${currentQuestion.answer}`, () => {
                setTimeout(nextQuestion, 1500);
            });
        }
    };

    const nextQuestion = () => {
        dispatch({ type: 'NEXT_QUESTION' });
    };

    if (!currentQuestion) return null;

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
            <div className="w-full max-w-2xl z-10 flex flex-col h-full justify-between items-center py-8">
                <div className="w-full">
                    <ProgressBar current={currentQuestionIndex + 1} total={quizData?.questions.length || 0} />
                </div>

                <div className="flex-grow flex items-center justify-center my-8 w-full">
                    <h2 className="text-4xl font-bold leading-tight text-center drop-shadow-sm select-none">
                        {currentQuestion.question}
                    </h2>
                </div>

                <div className="flex flex-col items-center space-y-8 w-full">
                    <div className="relative" onClick={startListening} title="Mikrofonu manuel başlatmak için tıklayın">
                        <MicIndicator listening={listening} />
                    </div>

                    <div className="text-center h-20 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-inner">
                        <p className="text-2xl text-gray-600 dark:text-gray-300 font-medium">
                            {transcript ? `"${transcript}"` : (listening ? "..." : (error ? `Hata: ${error}. Tekrar deneyin.` : "Hazırlanıyor..."))}
                        </p>
                    </div>

                    {/* Controls for manual override/skip if needed? Not in requirements but helpful */}
                    <div className="flex space-x-4">
                        {listening ? (
                            <button onClick={() => stopListening()} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition animate-pulse">
                                Durdur ve Gönder ⏹️
                            </button>
                        ) : (
                            <button onClick={() => { processedRef.current = false; startListening(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                                Dinlemeyi Başlat 🎤
                            </button>
                        )}

                        <button onClick={nextQuestion} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                            Soruyu Atla ⏭️
                        </button>
                    </div>
                </div>
            </div>

            <FeedbackOverlay
                visible={showOverlay}
                isCorrect={feedback === 'correct'}
                correctAnswer={currentQuestion.answer}
            />
        </div>
    );
};
