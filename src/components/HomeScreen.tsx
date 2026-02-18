import { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import type { QuizData } from '../types/quiz';
import sampleData from '../assets/sample.json';

export const HomeScreen = () => {
    const { state: { quizData }, dispatch } = useQuiz();
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string) as QuizData;
                if (!json.questions || !Array.isArray(json.questions)) {
                    throw new Error("Geçersiz JSON formatı: 'questions' dizisi bulunamadı.");
                }
                dispatch({ type: 'LOAD_QUIZ', payload: json });
                setError(null);
            } catch (err) {
                console.error(err);
                setError('JSON dosyası okunamadı veya format hatalı.');
            }
        };
        reader.readAsText(file);
    };

    const loadSample = () => {
        dispatch({ type: 'LOAD_QUIZ', payload: sampleData as QuizData });
    };

    const startQuiz = () => {
        dispatch({ type: 'START_QUIZ' });
    }

    const { voices } = useSpeechSynthesis();

    // Debug info for voices
    const trVoices = voices.filter(v => v.lang.includes('tr') || v.lang.includes('TK'));

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <div className="text-center space-y-2">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
                    Sesli Quiz
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Sesli etkileşimli bilgi yarışması</p>
                <p className="text-xs text-gray-400 mt-2">v1.0.3 (Fix: Cutoff & Voice Wait)</p>
                {trVoices.length > 0 ?
                    <p className="text-xs text-green-500">✅ {trVoices.length} Türkçe Ses Bulundu ({trVoices[0].name})</p> :
                    <p className="text-xs text-red-500">⚠️ Türkçe Ses Bekleniyor... (Sayfayı yenileyin)</p>
                }
            </div>

            {!quizData ? (
                <div className="flex flex-col items-center space-y-6 w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-xl font-semibold">Quiz Yükle</h2>

                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">JSON Dosyası Seç</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            id="file_input"
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="relative flex py-2 items-center w-full">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">VEYA</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <button
                        onClick={loadSample}
                        className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Örnek Soru Seti İle Başla
                    </button>

                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <span className="font-medium">Hata!</span> {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-8 w-full max-w-lg">
                    <div className="p-8 bg-white border-t-4 border-blue-500 rounded-2xl shadow-2xl dark:bg-gray-800 dark:border-blue-500">
                        <h5 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{quizData.quiz_title}</h5>
                        <p className="mb-6 font-normal text-gray-700 dark:text-gray-300 text-lg">{quizData.description}</p>
                        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                            Toplam {quizData.questions.length} Soru
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        className="w-full px-8 py-4 text-2xl font-bold text-center text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all focus:ring-4 focus:ring-green-200"
                    >
                        BAŞLA 🚀
                    </button>

                    <button
                        onClick={() => dispatch({ type: 'RESET_TO_HOME' })}
                        className="block mx-auto mt-4 text-sm text-gray-500 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        Farklı Dosya Seç
                    </button>
                </div>
            )}
        </div>
    );
}
