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
      <div style={{ backgroundColor: '#52275A' }} className="p-6 rounded-3xl shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white mb-1 font-semibold text-lg">Total Entries</p>
            <p className="text-4xl font-bold text-white">{totalEntries}</p>
          </div>
          <Users size={48} className="text-white opacity-90" />
        </div>
      </div>
      
      <div style={{ backgroundColor: '#6E3371' }} className="p-6 rounded-3xl shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white mb-1 font-semibold text-lg">Active Sections</p>
            <p className="text-4xl font-bold text-white">{activeSections}</p>
          </div>
          <Briefcase size={48} className="text-white opacity-90" />
        </div>
      </div>
      
      <div style={{ backgroundColor: '#FFD058' }} className="p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: '#52275A' }} className="mb-1 font-semibold text-lg">Upcoming Events</p>
            <p style={{ color: '#52275A' }} className="text-4xl font-bold">{upcomingEvents}</p>
          </div>
          <Calendar size={48} style={{ color: '#52275A' }} />
        </div>
      </div>
    </div>
  );
}