export const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow mb-6">
        <span className="text-white font-bold text-4xl tracking-tight">AS</span>
      </div>
      
      <h2 className="text-3xl font-semibold text-neutral-50 mb-3 tracking-tight">
        Welcome to AgentSmith
      </h2>
      
      <p className="text-base text-neutral-400 mb-8 max-w-md leading-relaxed">
        Upload a PDF document and ask questions about its content using advanced RAG technology
      </p>

      <div className="flex flex-col sm:flex-row gap-3 text-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span className="text-neutral-300 font-medium">Chat with AI</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-neutral-300 font-medium">Upload Documents</span>
        </div>
      </div>
    </div>
  );
};