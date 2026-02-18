import { createContext, useContext, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { QuizData } from '../types/quiz';

interface QuizState {
    quizData: QuizData | null;
    currentQuestionIndex: number;
    score: number;
    status: 'idle' | 'playing' | 'finished';
    answers: boolean[];
}

type QuizAction =
    | { type: 'LOAD_QUIZ'; payload: QuizData }
    | { type: 'START_QUIZ' }
    | { type: 'ANSWER_QUESTION'; payload: { isCorrect: boolean } }
    | { type: 'NEXT_QUESTION' }
    | { type: 'RESTART_QUIZ' }
    | { type: 'RESET_TO_HOME' };

const initialState: QuizState = {
    quizData: null,
    currentQuestionIndex: 0,
    score: 0,
    status: 'idle',
    answers: [],
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
        case 'LOAD_QUIZ':
            return { ...initialState, quizData: action.payload };
        case 'START_QUIZ':
            return { ...state, status: 'playing', currentQuestionIndex: 0, score: 0, answers: [] };
        case 'ANSWER_QUESTION':
            return {
                ...state,
                score: action.payload.isCorrect ? state.score + 1 : state.score,
                answers: [...state.answers, action.payload.isCorrect],
            };
        case 'NEXT_QUESTION':
            if (!state.quizData) return state;
            const nextIndex = state.currentQuestionIndex + 1;
            if (nextIndex >= state.quizData.questions.length) {
                return { ...state, status: 'finished' };
            }
            return { ...state, currentQuestionIndex: nextIndex };
        case 'RESTART_QUIZ':
            return { ...state, status: 'playing', currentQuestionIndex: 0, score: 0, answers: [] };
        case 'RESET_TO_HOME':
            return { ...initialState };
        default:
            return state;
    }
};

const QuizContext = createContext<{
    state: QuizState;
    dispatch: Dispatch<QuizAction>;
} | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    // Try to load state from local storage? Requirement says "no external libraries", doesn't forbid localStorage but plain state is fine.
    const [state, dispatch] = useReducer(quizReducer, initialState);

    return (
        <QuizContext.Provider value={{ state, dispatch }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};
