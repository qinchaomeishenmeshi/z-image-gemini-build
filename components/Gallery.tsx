import React, { useEffect, useRef, useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, Loader, Copy, Check } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete?: (id: string) => void;
  onView: (image: GeneratedImage) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ 
  images, 
  onView,
  onLoadMore,
  hasMore = false,
  isLoading = false
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = async (e: React.MouseEvent, prompt: string, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (images.length === 0 && !isLoading) {
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
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-4">
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
               <div 
                 className="mb-2 cursor-pointer hover:bg-black/40 p-1 rounded transition-colors group/text"
                 onClick={(e) => handleCopyPrompt(e, img.prompt, img.id)}
                 title="Click to copy prompt"
               >
                 <p className="text-xs text-gray-200 line-clamp-2 font-mono group-hover/text:text-white transition-colors">
                   {img.prompt}
                 </p>
                 <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-400 opacity-0 group-hover/text:opacity-100 transition-opacity">
                   {copiedId === img.id ? (
                     <><Check className="w-3 h-3" /> Copied!</>
                   ) : (
                     <><Copy className="w-3 h-3" /> Click to copy</>
                   )}
                 </div>
               </div>
               <div className="flex justify-end items-center">
                  <div className="flex gap-2">
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

      {/* Loader Trigger */}
      <div ref={loaderRef} className="py-8 flex justify-center w-full">
        {isLoading && (
           <div className="flex items-center gap-2 text-gray-400">
             <Loader className="w-6 h-6 animate-spin" />
           </div>
        )}
      </div>
    </>
  );
};