import { useEffect, useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

const QuizApp = () => {
  const { state } = useQuiz();

  // Check browser support
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  if (!supported) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-50 text-red-900">
        <svg className="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h1 className="text-2xl font-bold mb-2">Desteklenmeyen Tarayıcı</h1>
        <p className="max-w-md">
          Web Speech API desteği bulunamadı. Lütfen <strong>Google Chrome</strong> (Masaüstü/Android) kullanarak tekrar deneyiniz.
          <br /><br />
          iOS Safari ve Firefox şu an için tam desteklenmemektedir.
        </p>
      </div>
    );
  }

  // Simple routing based on status
  switch (state.status) {
    case 'playing':
      return <QuizScreen />;
    case 'finished':
      return <ResultScreen />;
    case 'idle':
    default:
      return <HomeScreen />;
  }
};

function App() {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  )
}

export default App
