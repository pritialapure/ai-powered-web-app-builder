import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = 'gemini-2.5-flash';

export const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const textResponse = response.candidates[0].content.parts[0].text;
    return textResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content from AI.');
  }
};
