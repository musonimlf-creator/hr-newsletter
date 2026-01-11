'use client';

import React from 'react';

interface PreviewSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  gradient: string;
  children: React.ReactNode;
}

export function PreviewSection({ title, icon: Icon, gradient, children }: PreviewSectionProps) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl mb-8 border border-primary-100">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-primary-100">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-linear-to-r ${gradient}`}>
          <Icon className="text-white" size={28} />
        </div>
        <h3 className="text-3xl font-bold text-primary-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}