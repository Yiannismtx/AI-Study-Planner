
import React from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div 
      className={`p-3 rounded-lg flex items-start gap-3 transition-colors duration-300 ${task.completed ? 'bg-green-500/10' : 'bg-slate-800'}`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="mt-1 h-5 w-5 rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-600 cursor-pointer"
      />
      <div className="flex-1">
        <p className={`font-medium text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
          {task.task}
        </p>
        <p className={`text-sm text-slate-400 ${task.completed ? 'line-through' : ''}`}>
          {task.description}
        </p>
      </div>
    </div>
  );
};

export default TaskItem;
