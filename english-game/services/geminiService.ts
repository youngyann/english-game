
import { GoogleGenAI } from "@google/genai";

/* Fix: Initialize GoogleGenAI with { apiKey: process.env.API_KEY } directly before each API call */
export const generateRewardImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      throw new Error("MISSING_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A cute, colorful cartoon sticker of ${prompt} for a Grade 1 kid. White background, high quality, 3D style.` }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    console.error("Error generating reward image:", error);
    if (error.message === "MISSING_API_KEY") throw error;
  }
  return undefined;
};

/* Fix: Use gemini-3-flash-preview for text generation tasks and use .text property directly */
export const getCelebrationMessage = async (score: number, total: number): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      throw new Error("MISSING_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very encouraging and short celebration message for a Grade 1 student who got ${score} out of ${total} correct in a vocabulary quiz. 
      The message MUST include:
      1. An English part.
      2. A Traditional Chinese part WITH Zhuyin (Bopomofo) symbols in parentheses next to EACH character (e.g., 棒(ㄅㄤˋ)極(ㄐㄧˊ)了(ㄌㄜ˙)).
      Keep it fun and use emojis.`,
    });
    return response.text || "Great job! 你(ㄋㄧˇ)太(ㄊㄞˋ)棒(ㄅㄤˋ)了(ㄌㄜ˙)！";
  } catch (error: any) {
    console.error("Error getting celebration message:", error);
    if (error.message === "MISSING_API_KEY") throw error;
    return "Amazing work! 繼(ㄐㄧˋ)續(ㄒㄩˋ)加(ㄐㄧㄚ)油(ㄧㄡˊ)！";
  }
};
