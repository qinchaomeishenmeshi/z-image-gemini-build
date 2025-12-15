import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { Gallery } from './components/Gallery';
import { ImageViewer } from './components/ImageViewer';
import { GeneratedImage } from './types';
import { ImageService } from './services/imageService';

const App: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [viewingImage, setViewingImage] = useState<GeneratedImage | null>(null);

  // Pagination State
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadHistory = useCallback(async (isInitial = false) => {
    // Prevent loading if already loading or no more data (unless it's an initial force load)
    if (isLoadingHistory || (!isInitial && !hasMore)) return;

    setIsLoadingHistory(true);
    try {
      const limit = isInitial ? 15 : 5;
      // If initial, offset 0. If loading more, offset is current count.
      // Note: This assumes no new items are added externally.
      const offset = isInitial ? 0 : history.length;
      
      const tasks = await ImageService.getHistory(limit, offset);
      
      const mappedImages: GeneratedImage[] = tasks
        .filter(t => t.status === 'COMPLETED' && t.result_url)
        .map(t => ({
          id: t.id,
          url: t.result_url!,
          prompt: t.prompt,
          timestamp: new Date(t.created_at).getTime(),
          width: t.width,
          height: t.height
        }));

      if (tasks.length < limit) {
        setHasMore(false);
      }

      setHistory(prev => isInitial ? mappedImages : [...prev, ...mappedImages]);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [history.length, hasMore, isLoadingHistory]);

  // Initial Load
  useEffect(() => {
    loadHistory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    try {
      const task = await ImageService.generateImage(prompt, (t) => {
        setGenerationProgress(typeof t.progress === 'number' ? t.progress : 0);
      });

      const newImage: GeneratedImage = {
        id: task.id,
        url: task.result_url!,
        prompt: task.prompt,
        timestamp: new Date(task.created_at).getTime(),
        width: task.width,
        height: task.height
      };

      setHistory(prev => [newImage, ...prev]);
    } catch (error) {
      alert(`Generation Failed: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDelete = (id: string) => {
    // Currently only deletes from local view
    // TODO: Implement API delete if available
    setHistory(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans selection:bg-indigo-500/30">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }}>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <div className="flex flex-col gap-8">
            {/* Top Section: Controls */}
            <section className="w-full max-w-4xl mx-auto">
               <ControlPanel 
                 prompt={prompt}
                 setPrompt={setPrompt}
                 onGenerate={handleGenerate}
                 isGenerating={isGenerating}
                 progress={generationProgress}
               />
            </section>

            {/* Bottom Section: Gallery */}
            <section>
                <div className="flex items-center gap-3 mb-4 border-b border-[#2d2d2d] pb-2">
                    <h2 className="text-xl font-bold text-gray-100">Creation History</h2>
                    <span className="text-xs font-mono text-gray-500 bg-[#1e1e1e] px-2 py-1 rounded-full border border-[#2d2d2d]">
                        {history.length} items loaded
                    </span>
                </div>
                <Gallery 
                    images={history} 
                    onDelete={handleDelete}
                    onView={setViewingImage}
                    onLoadMore={() => loadHistory(false)}
                    hasMore={hasMore}
                    isLoading={isLoadingHistory}
                />
            </section>
        </div>
      </main>

      <ImageViewer 
        image={viewingImage} 
        onClose={() => setViewingImage(null)} 
      />
    </div>
  );
};

export default App;
