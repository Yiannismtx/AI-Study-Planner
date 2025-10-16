
import React, { useState } from 'react';
import type { StudyPlan } from '../types';
import TaskItem from './TaskItem';

interface StudyPlanDisplayProps {
  plan: StudyPlan;
  onToggleTask: (weekIndex: number, dayIndex: number, taskIndex: number) => void;
}

const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({ plan, onToggleTask }) => {
  const [openWeeks, setOpenWeeks] = useState<Record<number, boolean>>({ 0: true });

  const toggleWeek = (weekIndex: number) => {
    setOpenWeeks(prev => ({ ...prev, [weekIndex]: !prev[weekIndex] }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">{plan.planTitle}</h2>

      {plan.weeklyBreakdown.map((week, weekIndex) => {
        const totalTasks = week.dailyTasks.reduce((acc, day) => acc + day.tasks.length, 0);
        const completedTasks = week.dailyTasks.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0);
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return (
          <div key={week.week} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleWeek(weekIndex)}
              className="w-full p-4 flex justify-between items-center text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-sky-400">Week {week.week}</p>
                <h3 className="text-xl font-bold text-white">{week.theme}</h3>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 text-slate-400 transition-transform ${openWeeks[weekIndex] ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {openWeeks[weekIndex] && (
              <div className="p-4 space-y-4">
                 <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                {week.dailyTasks.map((day, dayIndex) => (
                  <div key={day.day} className="pl-4 border-l-2 border-slate-700">
                    <h4 className="font-semibold text-slate-300 mb-2">{day.day}</h4>
                    <div className="space-y-2">
                      {day.tasks.map((task, taskIndex) => (
                        <TaskItem
                          key={taskIndex}
                          task={task}
                          onToggle={() => onToggleTask(weekIndex, dayIndex, taskIndex)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudyPlanDisplay;
