
import { GoogleGenAI } from "@google/genai";

// Always use the recommended initialization format with the process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNutritionAdvice = async (prompt: string, userContext: string) => {
  try {
    // Upgraded to gemini-3-pro-preview for advanced reasoning and expert-level advice.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a world-class elite nutritionist and fitness coach. 
        The user's current context is: ${userContext}. 
        Provide concise, expert-level advice. Use a supportive but direct "luxury coaching" tone. 
        Format your response in professional Markdown.`,
        temperature: 0.8,
      },
    });
    // Property access .text (not a method call)
    return response.text || "I'm sorry, I couldn't process that request at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The elite server is currently busy. Please try again in a moment.";
  }
};

export const analyzeMealPhoto = async (base64Image: string) => {
  try {
    // Upgraded to gemini-3-pro-preview for complex image understanding and macro estimation.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Estimate the calories and macros (Protein, Carbs, Fats) for this meal. Provide a brief breakdown and health tip." }
        ]
      },
      config: {
        systemInstruction: "You are a professional food analyst. Be precise with estimates."
      }
    });
    // Property access .text (not a method call)
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing the image.";
  }
};
