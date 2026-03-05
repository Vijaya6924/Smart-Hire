import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const screenResume = async (resumeText: string, jobDescription: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Screen this resume against the job description. Provide a score out of 100 and a brief summary of matching skills.
    
    Job Description: ${jobDescription}
    Resume: ${resumeText}`,
    config: {
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text || "{}");
};

export const getSkillMatching = async (userSkills: string[], requiredSkills: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare these user skills with the required skills. Identify gaps and strengths.
    User Skills: ${userSkills.join(", ")}
    Required Skills: ${requiredSkills.join(", ")}`,
    config: {
      responseMimeType: "application/json",
    },
  });
  return JSON.parse(response.text || "{}");
};
