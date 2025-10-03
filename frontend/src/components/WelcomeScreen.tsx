export const WelcomeScreen = () => {
  return (
    <div className="text-center mt-20">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white font-bold text-3xl">AS</span>
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">
        Welcome to AgentSmith
      </h2>
      <p className="text-gray-400 mb-4">
        Upload a PDF and ask questions about it using RAG
      </p>
      <p className="text-sm text-gray-500">Or start a regular conversation</p>
    </div>
  );
};