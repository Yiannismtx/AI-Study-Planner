
import React from 'react';

export const Welcome: React.FC = () => {
  return (
    <div className="text-center p-8 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/20 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a3.375 3.375 0 00-2.923-2.923L12 17.25l1.188-.398a3.375 3.375 0 002.923-2.923L16.5 12.75l.398 1.188a3.375 3.375 0 002.923 2.923L21 17.25l-1.188.398a3.375 3.375 0 00-2.923 2.923z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white">Welcome to Your AI Study Planner</h3>
      <p className="mt-2 text-slate-400">Ready to master a new skill? Fill out the form to the left with your topic and availability, and let our AI create a customized, step-by-step study plan just for you.</p>
    </div>
  );
};
