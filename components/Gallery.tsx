import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Trash2, Maximize2 } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onView: (image: GeneratedImage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onDelete, onView }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-[#2d2d2d] rounded-lg bg-[#1a1a1a]">
        <div className="flex flex-col items-center text-gray-500">
            <div className="w-16 h-16 bg-[#2d2d2d] rounded-full flex items-center justify-center mb-4">
                <Maximize2 className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">No images generated yet</p>
            <p className="text-sm">Enter a prompt above to start creating.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-10">
      {images.map((img) => (
        <div 
            key={img.id} 
            className="break-inside-avoid relative group bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2d2d2d] hover:border-indigo-500/50 transition-colors"
        >
          <img 
            src={img.url} 
            alt={img.prompt} 
            className="w-full h-auto object-cover cursor-pointer"
            onClick={() => onView(img)}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
             <p className="text-xs text-gray-200 line-clamp-2 mb-2 font-mono">{img.prompt}</p>
             <div className="flex justify-end items-center">
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
                        className="p-1.5 bg-red-900/80 hover:bg-red-700 text-white rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a 
                        href={img.url} 
                        download={`z-image-${img.id}.png`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded transition-colors"
                        title="Download"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </a>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};