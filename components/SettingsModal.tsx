import React from 'react';
import { X, Server, AlertTriangle } from 'lucide-react';
import { AppSettings } from '../types';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-[#3d3d3d] rounded-lg shadow-2xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" />
            Backend Configuration
        </h2>

        <div className="space-y-6">
            <div className="p-3 bg-indigo-900/20 border border-indigo-900/50 rounded text-sm text-indigo-200">
                <p>By default, Z-Image uses the internal cloud engine (Gemini). Enable Custom Backend to connect to your own deployed service.</p>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Use Custom Backend</label>
                <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${localSettings.useCustomBackend ? 'bg-indigo-600' : 'bg-gray-700'}`}
                    onClick={() => setLocalSettings(prev => ({...prev, useCustomBackend: !prev.useCustomBackend}))}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${localSettings.useCustomBackend ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>

            {localSettings.useCustomBackend && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-gray-300">Backend URL</label>
                    <input 
                        type="url"
                        value={localSettings.customBackendUrl}
                        onChange={(e) => setLocalSettings(prev => ({...prev, customBackendUrl: e.target.value}))}
                        placeholder="https://api.myservice.com/v1/generate"
                        className="w-full bg-[#121212] border border-[#3d3d3d] rounded px-3 py-2 text-sm text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Must accept POST requests with JSON body.
                    </p>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { onSave(localSettings); onClose(); }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};