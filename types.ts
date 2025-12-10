export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  timestamp: number;
  aspectRatio: string;
  width?: number;
  height?: number;
}

export interface AppSettings {
  useCustomBackend: boolean;
  customBackendUrl: string;
  apiKey?: string; // Optional override for Gemini Key if we wanted UI entry (not used here per rules, but good for structure)
}

export enum AspectRatio {
  Square = "1:1",
  Portrait = "9:16",
  Landscape = "16:9",
  Classic = "4:3",
  Wide = "21:9" // Mapped to nearest supported
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';