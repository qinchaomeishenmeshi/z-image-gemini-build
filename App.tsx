import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { Gallery } from './components/Gallery';
import { SettingsModal } from './components/SettingsModal';
import { ImageViewer } from './components/ImageViewer';
import { GeneratedImage, AspectRatio, AppSettings } from './types';
import { ImageService } from './services/imageService';

const App: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<GeneratedImage | null>(null);
  
  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    useCustomBackend: false,
    customBackendUrl: ''
  });

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('z-image-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage on update
  useEffect(() => {
    localStorage.setItem('z-image-history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      let imageUrl = '';
      
      // Pass the custom backend URL if enabled, otherwise undefined
      // The service layer handles the default URL and environment proxy logic
      const customUrl = settings.useCustomBackend ? settings.customBackendUrl : undefined;
      
      imageUrl = await ImageService.generateImage(prompt, customUrl);

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt.trim(),
        timestamp: Date.now()
      };

      setHistory(prev => [newImage, ...prev]);
    } catch (error) {
      alert(`Generation Failed: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
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

      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <div className="flex flex-col gap-8">
            {/* Top Section: Controls */}
            <section className="w-full max-w-4xl mx-auto">
               <ControlPanel 
                 prompt={prompt}
                 setPrompt={setPrompt}
                 onGenerate={handleGenerate}
                 isGenerating={isGenerating}
               />
            </section>

            {/* Bottom Section: Gallery */}
            <section>
                <div className="flex items-center gap-3 mb-4 border-b border-[#2d2d2d] pb-2">
                    <h2 className="text-xl font-bold text-gray-100">Creation History</h2>
                    <span className="text-xs font-mono text-gray-500 bg-[#1e1e1e] px-2 py-1 rounded-full border border-[#2d2d2d]">
                        {history.length} items
                    </span>
                </div>
                <Gallery 
                    images={history} 
                    onDelete={handleDelete}
                    onView={setViewingImage}
                />
            </section>
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

      <ImageViewer 
        image={viewingImage} 
        onClose={() => setViewingImage(null)} 
      />
    </div>
  );
};

export default App;