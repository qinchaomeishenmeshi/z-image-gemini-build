import React from 'react';
import { AspectRatio } from '../types';
import { Button } from './Button';
import { Wand2, Image as ImageIcon } from 'lucide-react';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
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