import React, { useState, useRef } from 'react';
import type { FormState, StudyPlan } from '../types';

interface StudyInputFormProps {
  onGenerate: (formState: FormState) => void;
  isLoading: boolean;
  onPlanImport: (plan: StudyPlan) => void;
}

const StudyInputForm: React.FC<StudyInputFormProps> = ({ onGenerate, isLoading, onPlanImport }) => {
  const [topics, setTopics] = useState('');
  
  const today = new Date();
  const oneWeekFromNow = new Date(today.setDate(today.getDate() + 8));
  const defaultDate = oneWeekFromNow.toISOString().split('T')[0];

  const [testDate, setTestDate] = useState(defaultDate);
  const [comfortLevel, setComfortLevel] = useState('Intermediate');

  const topicsFileInputRef = useRef<HTMLInputElement>(null);
  const planFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topics.trim() === '') {
      alert('Please enter the test topics.');
      return;
    }
    if (new Date(testDate) <= new Date()) {
      alert('Please select a future date for the test.');
      return;
    }
    onGenerate({ topics, testDate, comfortLevel });
  };
  
  const handleTopicsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setTopics(text);
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset file input
  };

  const handlePlanFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const plan = JSON.parse(e.target?.result as string);
          if (plan.planTitle && plan.weeklyBreakdown) {
            onPlanImport(plan);
          } else {
            alert('Invalid plan file format.');
          }
        } catch (error) {
          alert('Failed to parse plan file. Make sure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
     event.target.value = ''; // Reset file input
  };


  const InputLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300">{children}</label>
  );

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-sky-400 mb-4">Prepare for Your Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <InputLabel htmlFor="topics">Test Topics</InputLabel>
            <input type="file" ref={topicsFileInputRef} onChange={handleTopicsFileChange} style={{display: 'none'}} accept=".txt,.md" />
            <button
              type="button"
              onClick={() => topicsFileInputRef.current?.click()}
              className="text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
            >
              Upload File
            </button>
          </div>
          <textarea
            id="topics"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g., Data Structures, European History, Organic Chemistry..."
            rows={4}
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="testDate">Test Date</InputLabel>
          <input
            id="testDate"
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition appearance-none"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="comfortLevel">Comfort Level</InputLabel>
          <select
            id="comfortLevel"
            value={comfortLevel}
            onChange={(e) => setComfortLevel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition appearance-none"
          >
            <option value="Beginner">Beginner (I'm new to this)</option>
            <option value="Intermediate">Intermediate (I know some basics)</option>
            <option value="Advanced">Advanced (I need a refresher)</option>
          </select>
        </div>
        
        <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a3.375 3.375 0 00-2.923-2.923L12 17.25l1.188-.398a3.375 3.375 0 002.923-2.923L16.5 12.75l.398 1.188a3.375 3.375 0 002.923 2.923L21 17.25l-1.188.398a3.375 3.375 0 00-2.923 2.923z" />
                  </svg>
                  Generate Plan
                </>
              )}
            </button>
            <input type="file" ref={planFileInputRef} onChange={handlePlanFileChange} style={{display: 'none'}} accept=".json" />
            <button
              type="button"
              onClick={() => planFileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-700/50 text-slate-300 font-medium py-2 px-4 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" /></svg>
              Import Study Plan
            </button>
        </div>

      </form>
    </div>
  );
};

export default StudyInputForm;
