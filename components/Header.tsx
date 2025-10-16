
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-slate-800">
      <div className="container mx-auto px-4 flex items-center gap-3">
         <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-sky-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Study Planner
        </h1>
      </div>
    </header>
  );
};

export default Header;
