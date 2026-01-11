'use client';

import React from 'react';
import { Users, Briefcase, Calendar } from 'lucide-react';

interface StatsCardsProps {
  totalEntries: number;
  activeSections: number;
  upcomingEvents: number;
}

export function StatsCards({ totalEntries, activeSections, upcomingEvents }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="p-6 rounded-3xl shadow-xl text-white bg-[#52275A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white mb-1 font-semibold text-lg">Total Entries</p>
            <p className="text-4xl font-bold text-white">{totalEntries}</p>
          </div>
          <Users size={48} className="text-white opacity-90" />
        </div>
      </div>
      
      <div className="p-6 rounded-3xl shadow-xl text-white bg-[#6E3371]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white mb-1 font-semibold text-lg">Active Sections</p>
            <p className="text-4xl font-bold text-white">{activeSections}</p>
          </div>
          <Briefcase size={48} className="text-white opacity-90" />
        </div>
      </div>
      
      <div className="p-6 rounded-3xl shadow-xl bg-[#FFD058]">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 font-semibold text-lg text-[#52275A]">Upcoming Events</p>
            <p className="text-4xl font-bold text-[#52275A]">{upcomingEvents}</p>
          </div>
          <Calendar size={48} className="text-[#52275A]" />
        </div>
      </div>
    </div>
  );
}