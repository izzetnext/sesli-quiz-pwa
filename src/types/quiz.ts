export interface Question {
    id: number;
    category: string;
    question: string;
    answer: string;
}

export interface QuizData {
    quiz_title: string;
    description: string;
    questions: Question[];
}
