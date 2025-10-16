import React, { useState, useRef } from 'react';
import type { FormState, StudyPlan } from './types';
import { generateStudyPlan } from './services/geminiService';
import Header from './components/Header';
import StudyInputForm from './components/StudyInputForm';
import StudyPlanDisplay from './components/StudyPlanDisplay';
import { Welcome } from './components/Welcome';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const handleGeneratePlan = async (formState: FormState) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setStudyPlan(null);
    try {
      const plan = await generateStudyPlan(formState);
      if (controller.signal.aborted) {
        return;
      }
      
      const planWithCompletion = {
        ...plan,
        weeklyBreakdown: plan.weeklyBreakdown.map(week => ({
          ...week,
          dailyTasks: week.dailyTasks.map(day => ({
            ...day,
            tasks: day.tasks.map(task => ({ ...task, completed: false }))
          }))
        }))
      };
      setStudyPlan(planWithCompletion);
      setIsFormCollapsed(true);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };
  
  const handleToggleTask = (weekIndex: number, dayIndex: number, taskIndex: number) => {
    if (!studyPlan) return;

    const newPlan = { ...studyPlan };
    const task = newPlan.weeklyBreakdown[weekIndex].dailyTasks[dayIndex].tasks[taskIndex];
    task.completed = !task.completed;
    
    setStudyPlan(newPlan);
  };

  const handleReset = () => {
    setStudyPlan(null);
    setError(null);
    setIsLoading(false);
    setIsFormCollapsed(false);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setError(null);
  };
  
  const handleExportPlan = () => {
    if (!studyPlan) return;
    const jsonString = JSON.stringify(studyPlan, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-plan-${studyPlan.planTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportPlan = (plan: StudyPlan) => {
    setStudyPlan(plan);
    setIsFormCollapsed(true);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-sky-500 selection:text-white">
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] gap-8 items-start">
          <div className="md:sticky md:top-8">
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFormCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
              <StudyInputForm 
                onGenerate={handleGeneratePlan} 
                isLoading={isLoading} 
                onPlanImport={handleImportPlan}
              />
            </div>
             {isLoading && (
                <button
                  onClick={handleCancel}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors"
                  aria-label="Cancel study plan generation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
             )}
             {studyPlan && !isLoading && (
                <div className="space-y-2 mt-4">
                   <button
                    onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors"
                  >
                     {isFormCollapsed ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.964.82h.048c.474 0 .884-.346.964-.82l.073-.438c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.964.82h.048c.474 0 .884-.346.964-.82l.073-.438c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.964.82h.048c.474 0 .884-.346.964-.82l.073-.438zm-18.632 0c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.964.82h.048c.474 0 .884-.346.964-.82l.073-.438c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.964.82h.048c.474 0 .884-.346.964-.82l.073-.438z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12s4.365 9.75 9.75 9.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v4.5m0 4.5h.008v.008H12v-.008z" /></svg>
                        Show Settings
                      </>
                     ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        Hide Settings
                      </>
                     )}
                  </button>
                  <button
                    onClick={handleExportPlan}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-sky-600/20 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-600/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    Export Plan
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-rose-600/20 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-600/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 00-11.664 0l-3.181 3.183" />
                    </svg>
                    Start Over
                  </button>
                </div>
            )}
          </div>
          <div className="md:col-span-1">
            {isLoading && <LoadingSpinner />}
            {error && <div className="p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
            {!isLoading && !error && !studyPlan && <Welcome />}
            {studyPlan && <StudyPlanDisplay plan={studyPlan} onToggleTask={handleToggleTask} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
