
import { GoogleGenAI, Type } from "@google/genai";
import { MathResponse } from "../types";

export const solveMathProblem = async (problem: string): Promise<MathResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an advanced AI Mathematics Engine called Axiom. 
    Your role is to solve any mathematical problem by pure reasoning and logical derivation.
    
    Guidelines:
    1. Identify the domain (e.g., Calculus, Algebra, etc.).
    2. Provide a step-by-step breakdown.
    3. Use LaTeX notation for all formulas (wrap in $ or $$).
    4. Provide clear assumptions (e.g., domain of x, degrees vs radians).
    5. Always include a finalAnswer (plain text) and a latexAnswer (full LaTeX formatting).
    6. If multiple valid solution methods exist, provide them in alternativeMethods.
    
    Return the response strictly in JSON format.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      domain: { type: Type.STRING, description: "The mathematical domain of the problem." },
      problem: { type: Type.STRING, description: "The original problem restated." },
      assumptions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Assumptions made during solving."
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            formula: { type: Type.STRING, description: "LaTeX formula if applicable." }
          },
          required: ["title", "explanation"]
        }
      },
      alternativeMethods: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      finalAnswer: { type: Type.STRING },
      latexAnswer: { type: Type.STRING }
    },
    required: ["domain", "problem", "steps", "finalAnswer", "latexAnswer"]
  };

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: problem,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });

    const text = result.text;
    if (!text) throw new Error("No response from engine.");
    return JSON.parse(text) as MathResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
