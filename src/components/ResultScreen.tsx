import { useQuiz } from '../context/QuizContext';

export const ResultScreen = () => {
    const { state, dispatch } = useQuiz();
    const { score, quizData } = state;
    const total = quizData?.questions.length || 0;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-8">Sonuçlar</h1>

            <div className="relative w-48 h-48 mb-8">
                {/* Simple Circle using CSS borders */}
                <div
                    className="w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden"
                >
                    {/* Overlay for progress? Too complex for pure css without calc. Just text for now. */}
                    <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>
                </div>
            </div>

            <div className="text-3xl mb-12 space-x-4">
                <span className="font-bold text-green-500">{score}</span>
                <span className="text-sm uppercase text-gray-500">Doğru</span>
                <span className="text-xl text-gray-300">|</span>
                <span className="font-bold text-red-500">{total - score}</span>
                <span className="text-sm uppercase text-gray-500">Yanlış</span>
            </div>

            <div className="flex flex-col space-y-4 w-full max-w-xs">
                <button
                    onClick={() => dispatch({ type: 'RESTART_QUIZ' })}
                    className="w-full px-5 py-4 text-lg font-bold text-center text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg transform transition hover:-translate-y-1"
                >
                    Tekrar Oyna 🔄
                </button>
                <button
                    onClick={() => dispatch({ type: 'RESET_TO_HOME' })}
                    className="w-full px-5 py-4 text-lg font-medium text-center text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition"
                >
                    Yeni JSON Yükle 📂
                </button>
            </div>
        </div>
    );
};
