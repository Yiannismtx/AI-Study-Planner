import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, StudyPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const studyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    planTitle: { type: Type.STRING, description: 'A creative and motivating title for the study plan.' },
    weeklyBreakdown: {
      type: Type.ARRAY,
      description: 'An array of weekly plans.',
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER, description: 'The week number, starting from 1.' },
          theme: { type: Type.STRING, description: 'The main focus or theme for this week.' },
          dailyTasks: {
            type: Type.ARRAY,
            description: 'An array of daily tasks for the week.',
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: 'The day of the week and date (e.g., "Monday, October 28").' },
                tasks: {
                  type: Type.ARRAY,
                  description: 'A list of tasks for the day.',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      task: { type: Type.STRING, description: 'A short, actionable task title.' },
                      description: { type: Type.STRING, description: 'A brief one-sentence description of the task.' },
                    },
                    required: ['task', 'description'],
                  },
                },
              },
              required: ['day', 'tasks'],
            },
          },
        },
        required: ['week', 'theme', 'dailyTasks'],
      },
    },
  },
  required: ['planTitle', 'weeklyBreakdown'],
};

export const generateStudyPlan = async (formState: FormState): Promise<StudyPlan> => {
  const { topics, testDate, comfortLevel } = formState;

  const prompt = `
    You are an AI-powered study planner. A user needs a study plan for an upcoming test.

    Key Information:
    - Test Topics: "${topics}"
    - Test Date: "${testDate}"
    - User's Comfort Level: "${comfortLevel}"

    Your task is to generate a comprehensive, week-by-week, day-by-day study plan that starts from today and ends the day before the test date.
    
    Instructions:
    1.  Create a schedule that intelligently allocates time based on the user's comfort level. If they are a 'Beginner', start with fundamentals. If 'Advanced', focus on complex topics and review. For 'Intermediate', balance review with new material.
    2.  Break down the topics into manageable daily tasks. Each task must be specific and actionable.
    3.  For each week, provide a high-level theme or goal.
    4.  For each day, provide a clear date string (e.g., "Monday, October 28").
    5.  For each daily task, provide a concise task title and a one-sentence description.
    6.  Include review days and a final "cram session" or "final review" day right before the test date. Do not schedule any tasks on the test date itself.

    Your entire response MUST be a single JSON object that strictly follows the provided schema. Do not include any text, markdown, or explanations outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: studyPlanSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText);
    
    if (!parsedPlan.planTitle || !Array.isArray(parsedPlan.weeklyBreakdown)) {
      throw new Error("Invalid study plan structure received from API.");
    }
    
    return parsedPlan as StudyPlan;

  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan. The model may be unable to create a plan for the given topic or duration. Please try a different input.");
  }
};
