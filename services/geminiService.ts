
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client
// We safely access import.meta.env to avoid "Cannot read properties of undefined" errors
// in environments where Vite's injection hasn't happened yet.
const getApiKey = (): string => {
  try {
    // Cast to any to avoid TypeScript errors if types aren't fully set up
    return (import.meta as any).env?.VITE_API_KEY || '';
  } catch (error) {
    return '';
  }
};

const apiKey = getApiKey();

// Initialize with a fallback to prevent module-level crashes if key is missing
// The actual API call will validate the key.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const getAIResponse = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure VITE_API_KEY in your environment variables (e.g., .env file or Vercel settings).";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are OpsBot, a friendly and highly technical DevOps mentor. You help users with Docker, Kubernetes, CI/CD, Terraform, and Linux questions. Keep answers concise, practical, and use code blocks where helpful. Do not provide full solutions to homework, but guide them.",
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key and internet connection.";
  }
};
