export interface FormState {
  topics: string;
  testDate: string;
  comfortLevel: string;
}

export interface Task {
  task: string;
  description: string;
  completed: boolean;
}

export interface DailyPlan {
  day: string; // This can now be a specific date, e.g., "Monday, Oct 28"
  tasks: Task[];
}

export interface WeeklyBreakdown {
  week: number;
  theme: string;
  dailyTasks: DailyPlan[];
}

export interface StudyPlan {
  planTitle: string;
  weeklyBreakdown: WeeklyBreakdown[];
}
