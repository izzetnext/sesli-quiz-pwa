

export const ProgressBar = ({ current, total }: { current: number; total: number }) => {
    const percentage = Math.round(((current) / total) * 100);
    return (
        <div className="w-full max-w-xl mx-auto mb-6">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-white">Soru {current} / {total}</span>
                <span className="text-sm font-medium text-blue-700 dark:text-white">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};
