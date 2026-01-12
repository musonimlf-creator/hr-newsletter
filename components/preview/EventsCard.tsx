'use client';

import React from 'react';
import { CARD_CONFIG } from './cardConfig';
import { generateEventsBlurb } from './cardContent';
import type { Event } from '@/types/newsletter';

interface EventsCardProps {
  events: Event[];
}

export function EventsCard({ events }: EventsCardProps) {
  const config = CARD_CONFIG.events;
  if (!events || events.length === 0) return null;

  if (events.length === 1) {
    return (
      <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
        <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

        <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
          {config.icon}
          <span>{config.label}</span>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="font-serif text-2xl font-extrabold leading-tight text-slate-900 mb-4">Upcoming Events</h3>

          <p className="mb-4 text-slate-600">{generateEventsBlurb(events)}</p>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <h4 className="text-lg font-bold">{events[0].title}</h4>
            <p className="mt-2 text-sm text-slate-600">{events[0].description}</p>
            <div className="mt-3 text-sm text-slate-500">{events[0].date} {events[0].location ? `• ${events[0].location}` : ''}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
      <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="font-serif text-2xl font-extrabold leading-tight text-slate-900 mb-4">Upcoming Events</h3>

        <p className="mb-4 text-slate-600">{generateEventsBlurb(events)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
              <h4 className="text-base font-bold text-slate-800">{ev.title}</h4>
              <div className="mt-1 text-sm text-slate-500">{ev.date} {ev.location ? `• ${ev.location}` : ''}</div>
              <p className="mt-2 text-sm text-slate-600">{ev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
