'use client';

import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import type { Event } from '@/types/newsletter';

interface EventFormProps {
  event: Event;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export function EventForm({ event, onUpdate, onRemove }: EventFormProps) {
  return (
    <div className="bg-white backdrop-blur-sm p-5 rounded-2xl border-2 border-[#C2A2CB] mb-4 hover:border-[#6E3371] hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#52275A]" size={20} />
          <span className="text-sm font-medium text-[#52275A]">Event Details</span>
        </div>
        <button
          onClick={() => onRemove(event.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Event Title"
          value={event.title}
          onChange={(e) => onUpdate(event.id, 'title', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <input
          type="date"
          value={event.date}
          onChange={(e) => onUpdate(event.id, 'date', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <textarea
          placeholder="Event Description"
          value={event.description}
          onChange={(e) => onUpdate(event.id, 'description', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}