

export const MicIndicator = ({ listening }: { listening: boolean }) => {
    return (
        <div className={`flex flex-col items-center justify-center transition-opacity duration-300 ${listening ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900`}>
                <div className={`absolute w-full h-full rounded-full bg-red-500 opacity-20 ${listening ? 'animate-ping' : 'hidden'}`}></div>
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg ${listening ? 'scale-110' : ''} transition-transform duration-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a3 3 0 00-3 3v4.5a3 3 0 006 0v-4.5a3 3 0 00-3-3z" />
                    </svg>
                </div>
            </div>
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 animate-pulse">
                {listening ? 'Dinliyorum...' : 'Hazırlanıyor...'}
            </p>
        </div>
    );
};
