interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 mb-6">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold text-red-300 text-sm mb-1">Error</p>
          <p className="text-red-200 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    </div>
  );
};