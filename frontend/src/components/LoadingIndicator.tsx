export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-semibold text-sm text-neutral-300">
          AS
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl px-5 py-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};