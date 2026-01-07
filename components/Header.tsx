'use client';

import React from 'react';
import { Calendar, Download, Edit, Eye, Save, Sparkles } from 'lucide-react';
import type { ViewMode } from '@/types/newsletter';

interface HeaderProps {
  month: string;
  year: string;
  currentView: ViewMode;
  totalEntries: number;
  onViewChange: () => void;
  onSave: () => void;
  onExport: () => void;
  isAdmin: boolean;
  onRequestLogin: () => void;
}

export function Header({
  month,
  year,
  currentView,
  totalEntries,
  onViewChange,
  onSave,
  onExport,
  isAdmin,
  onRequestLogin,
}: HeaderProps) {
  return (
    <div style={{ backgroundColor: '#563061' }} className="text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div>
              <img
                src="/microloan-logo.png"
                alt="Microloan Foundation"
                className="h-full w-full object-contain rounded-lg"
                style={{background: 'transparent'}}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 drop-shadow-lg text-white leading-tight">Newsletters</h2>
              <p className="text-white text-lm font-semibold flex items-center gap-2">
                <Calendar size={20} style={{ color: '#FFD058' }} />
                {month} {year}
              </p>
              {currentView === 'editor' && (
                <p className="text-white text-xs mt-2 font-medium opacity-95">
                  {totalEntries} total entries
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 print:hidden">
            {isAdmin ? (
              <>
                <button
                  onClick={onSave}
                  style={{ backgroundColor: '#FFD058', color: '#52275A', borderColor: '#FFC700' }}
                  className="border-2 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 hover:opacity-90"
                >
                  <Save size={20} />
                  Save
                </button>
                <button
                  onClick={onViewChange}
                  style={{ backgroundColor: '#FFFFFF', color: '#52275A', borderColor: '#C2A2CB' }}
                  className="px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 border-2 hover:bg-gray-50"
                >
                  {currentView === 'editor' ? <Eye size={20} /> : <Edit size={20} />}
                  {currentView === 'editor' ? 'Preview' : 'Edit'}
                </button>
                {currentView === 'preview' && (
                  <button
                    onClick={onExport}
                    style={{ background: 'linear-gradient(to right, #FFD058, #FFC700)', color: '#52275A', borderColor: '#FFC700' }}
                    className="px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 border-2 hover:opacity-90"
                  >
                    <Download size={20} />
                    Export PDF
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onRequestLogin}
                style={{ backgroundColor: '#FFD058', color: '#52275A', borderColor: '#FFC700' }}
                className="border-2 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 hover:opacity-90"
              >
                <Sparkles size={20} />
                HR / Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
