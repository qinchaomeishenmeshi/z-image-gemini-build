/*
 * @Author: qinzhaoxuan 
 * @Date: 2025-12-11 10:01:04
 * @LastEditors: qinzhaoxuan
 * @LastEditTime: 2025-12-12 17:55:46
 * @Description: file content
 * @FilePath: /z-image-gemini-build/components/Header.tsx
 */
import React from 'react';
import { Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white font-mono">
          Z-IMAGE<span className="text-indigo-500">.AI</span>
        </h1>
      </div>
    </header>
  );
};