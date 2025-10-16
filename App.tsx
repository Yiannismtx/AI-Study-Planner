
import React, { useState } from 'react';
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
  
  const handleGeneratePlan = async (formState: FormState) => {
    setIsLoading(true);
    setError(null);
    setStudyPlan(null);
    try {
      const plan = await generateStudyPlan(formState);
      // Add client-side 'completed' status to each task
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
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
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-sky-500 selection:text-white">
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 md:sticky md:top-8">
            <StudyInputForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
             {studyPlan && (
                <button
                  onClick={handleReset}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-rose-600/20 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-600/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 00-11.664 0l-3.181 3.183" />
                  </svg>
                  Start Over
                </button>
            )}
          </div>
          <div className="md:col-span-2">
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
