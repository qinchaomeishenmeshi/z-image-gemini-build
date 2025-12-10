import React from 'react';
import { X, Download } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={onClose}>
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
            <X className="w-8 h-8" />
        </button>

        <div 
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" 
            onClick={e => e.stopPropagation()}
        >
            <img 
                src={image.url} 
                alt={image.prompt}
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
            />
            
            <div className="mt-4 flex flex-col md:flex-row items-center gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-[#333] w-full">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium truncate">{image.prompt}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                        {new Date(image.timestamp).toLocaleString()} • {image.aspectRatio}
                    </p>
                </div>
                <a 
                    href={image.url}
                    download={`z-image-${image.id}.png`}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
                >
                    <Download className="w-4 h-4" />
                    Download Original
                </a>
            </div>
        </div>
    </div>
  );
};