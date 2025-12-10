import React from 'react';
import { AspectRatio } from '../types';
import { Button } from './Button';
import { Wand2, Image as ImageIcon } from 'lucide-react';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (val: string) => void;
  negativePrompt: string;
  setNegativePrompt: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-4 shadow-xl mb-6">
      <div className="flex flex-col gap-4">
        {/* Main Prompt */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Positive Prompt</label>
             <span className="text-xs text-gray-500 font-mono">supports natural language</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your imagination... e.g., A futuristic city with neon lights, cyberpunk style, high detail"
            className="w-full bg-[#121212] border border-[#2d2d2d] rounded p-3 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px] resize-y font-mono custom-scrollbar"
          />
        </div>

        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Negative Prompt */}
            <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-red-400 uppercase tracking-wider">Negative Prompt</label>
                <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, bad quality, distorted..."
                    className="w-full bg-[#121212] border border-[#2d2d2d] rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-red-900 focus:ring-1 focus:ring-red-900 font-mono"
                />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aspect Ratio</label>
                <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-[#121212] border border-[#2d2d2d] rounded px-3 py-2 text-sm text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    {Object.values(AspectRatio).map((ratio) => (
                        <option key={ratio} value={ratio}>{ratio}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex justify-end">
            <Button 
                onClick={onGenerate} 
                disabled={!prompt.trim()} 
                isLoading={isGenerating}
                size="lg"
                className="w-full md:w-auto shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate
            </Button>
        </div>
      </div>
    </div>
  );
};