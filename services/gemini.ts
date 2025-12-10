import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const GEMINI_MODEL = 'gemini-2.5-flash-image';

export const generateImageWithGemini = async (
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Map our UI aspect ratios to Gemini supported ones if needed
  // Supported: "1:1", "3:4", "4:3", "9:16", "16:9"
  let targetRatio = aspectRatio;
  if (aspectRatio === AspectRatio.Wide) targetRatio = "16:9" as any;

  // Construct a robust prompt including negative constraints
  const finalPrompt = negativePrompt 
    ? `${prompt} --no ${negativePrompt}` 
    : prompt;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          { text: finalPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio as any,
          numberOfImages: 1
        }
      }
    });

    // Extract image
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data received from Gemini.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

// Mock function to simulate a custom backend call if the user configured it
export const generateImageCustomBackend = async (
  url: string,
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
    // This is a placeholder for actual custom backend logic
    // Expecting the backend to return a JSON with { image: "base64..." } or { url: "http..." }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, negative_prompt: negativePrompt, aspect_ratio: aspectRatio })
        });
        
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return data.image || data.url; 
    } catch (e) {
        throw new Error("Failed to connect to custom backend: " + (e as Error).message);
    }
}