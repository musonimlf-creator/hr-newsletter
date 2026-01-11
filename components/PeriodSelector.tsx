'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface PeriodSelectorProps {
  month: string;
  year: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

export function PeriodSelector({ month, year, onMonthChange, onYearChange }: PeriodSelectorProps) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg mb-8 border-2 border-primary-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#52275A] to-[#6E3371]">
          <Calendar className="text-white" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-[#52275A]">Newsletter Period</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-[#52275A]">Month</label>
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-3 text-[#52275A]">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium"
          />
        </div>
      </div>
    </div>
  );
}
