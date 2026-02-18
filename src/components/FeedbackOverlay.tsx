

interface FeedbackOverlayProps {
    visible: boolean;
    isCorrect: boolean;
    correctAnswer: string;
}

export const FeedbackOverlay = ({ visible, isCorrect, correctAnswer }: FeedbackOverlayProps) => {
    if (!visible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isCorrect ? 'bg-green-500/90' : 'bg-red-500/90'} backdrop-blur-sm`}>
            <div className="text-center text-white animate-bounce-in">
                <div className="mb-4">
                    {isCorrect ? (
                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                </div>
                <h2 className="text-5xl font-bold mb-4">{isCorrect ? 'Doğru!' : 'Yanlış!'}</h2>
                {!isCorrect && (
                    <div className="mt-4 text-xl">
                        <p className="opacity-80 mb-1">Doğru Cevap:</p>
                        <p className="font-bold text-3xl">{correctAnswer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
