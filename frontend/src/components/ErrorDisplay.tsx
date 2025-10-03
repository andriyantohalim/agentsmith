interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
      <p className="font-semibold">❌ Error:</p>
      <p>{error}</p>
    </div>
  );
};