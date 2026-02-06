import { GoogleGenAI } from "@google/genai";
import { JobListing, UserIdentity, Language } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';

function getAI() {
  if (!apiKey) throw new Error("API key not set");
  return new GoogleGenAI({ apiKey });
}

export const calculateRelevance = async (job: JobListing, identity: UserIdentity): Promise<number> => {
  if (!apiKey) return 50;
  try {
    const ai = getAI();
    const prompt = `
      Compare the following job listing and user identity to provide a relevance score between 0 and 100.
      Consider location accessibility: the user's means of transport is "${identity.meansOfTransport}".
      If the job is far from Nouméa and the user has no car, the score should be lower unless transport is provided.
      
      JOB:
      Title: ${job.title}
      Location: ${job.location}
      Description: ${job.description}
      Requirements: ${job.requirements.join(', ')}
      
      USER IDENTITY:
      Transport: ${identity.meansOfTransport}
      Skills: ${identity.skills.join(', ')}
      Summary: ${identity.experienceSummary}
      
      Repond only with the numeric score.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const scoreStr = response.text?.trim() || "50";
    const score = parseInt(scoreStr, 10);
    return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error("Gemini relevance error:", error);
    return 50;
  }
};

export const draftApplicationEmail = async (job: JobListing, identity: UserIdentity, lang: Language): Promise<string> => {
  if (!apiKey) return "";
  try {
    const ai = getAI();
    const prompt = `
      Draft a professional application email in ${lang === Language.EN ? 'English' : 'French'} for this job:
      Job Title: ${job.title} at ${job.company}
      
      Using this user profile:
      Name: ${identity.fullName}
      Experience: ${identity.experienceSummary}
      Skills: ${identity.skills.join(', ')}
      Transport: ${identity.meansOfTransport}
      
      The email should be professional, concise, and persuasive. Include placeholders like [Date] if needed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini email drafting error:", error);
    return "Error drafting email. Please try again.";
  }
};