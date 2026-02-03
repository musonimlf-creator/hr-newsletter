'use client';

import React from 'react';
import {
  Users,
  TrendingUp,
  Briefcase,
  Cake,
  Clock,
  Calendar,
  Award,
  Star,
  LogOut,
  MapPin,
} from 'lucide-react';

import type { NewsletterData } from '@/types/newsletter';
import { CARD_CONFIG } from '@/components/preview/cardConfig';
import { PreviewSection } from '@/components/preview/PreviewSection';
import { NewHiresCard } from '@/components/preview/NewHiresCard';
import { PromotionsCard } from '@/components/preview/PromotionsCard';
import { EmployeeCard } from '@/components/preview/EmployeeCard';
import { BirthdayCard } from '@/components/preview/BirthdayCard';

export function NewsletterPreview({ data }: { data: NewsletterData }) {
  // This component intentionally keeps the existing preview design unchanged.
  return (
    <>
      {data.newHires.length > 0 && (
        <PreviewSection title="Welcome to Our New Hires!" icon={Users} gradient="from-blue-500 to-blue-700">
          <NewHiresCard employees={data.newHires.slice().reverse()} />
        </PreviewSection>
      )}

      {data.promotions.length > 0 && (
        <PreviewSection title="Congratulations on Your Promotions!" icon={TrendingUp} gradient="from-green-500 to-green-700">
          <PromotionsCard employees={data.promotions.slice().reverse()} />
        </PreviewSection>
      )}

      {data.transfers.length > 0 && (
        <PreviewSection title="Employee Transfers" icon={Briefcase} gradient="from-purple-500 to-purple-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.transfers.slice().reverse().map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} type="transfers" />
            ))}
          </div>
        </PreviewSection>
      )}

      {data.birthdays.length > 0 && (
        <PreviewSection title="Upcoming Birthdays 🎂" icon={Cake} gradient="from-pink-500 to-pink-700">
          <BirthdayCard employees={data.birthdays.slice().reverse()} />
        </PreviewSection>
      )}

      {data.anniversaries.length > 0 && (
        <PreviewSection title="Work Anniversaries" icon={Clock} gradient="from-indigo-500 to-indigo-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.anniversaries.slice().reverse().map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} type="anniversaries" />
            ))}
          </div>
        </PreviewSection>
      )}

      {data.events.length > 0 && (
        <PreviewSection title="Upcoming Events" icon={Calendar} gradient="from-orange-500 to-orange-700">
          <div className="space-y-4">
            {data.events.slice().reverse().map((event) => (
              <div
                key={event.id}
                className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border-2 ${CARD_CONFIG.events.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
              >
                <div className={`h-2 w-full bg-linear-to-r ${CARD_CONFIG.events.gradient}`}></div>
                <div
                  className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${CARD_CONFIG.events.gradient} shadow-lg shadow-black/10`}
                >
                  {CARD_CONFIG.events.icon}
                  <span>{CARD_CONFIG.events.label}</span>
                </div>

                <div className="flex items-start gap-6 p-8">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl text-white bg-linear-to-br ${CARD_CONFIG.events.gradient} shrink-0 shadow-md`}
                  >
                    <Calendar size={32} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif font-extrabold text-4xl text-slate-900 mb-2">{event.title}</h3>

                    <div className="mt-6 flex flex-wrap gap-6">
                      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm border border-slate-100">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-white bg-linear-to-br ${CARD_CONFIG.events.gradient}`}
                        >
                          <Calendar size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm border border-slate-100">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-white bg-linear-to-br ${CARD_CONFIG.events.gradient}`}
                          >
                            <MapPin size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{event.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-8 text-xl leading-relaxed text-slate-600 font-medium">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {data.bestEmployee && (
        <PreviewSection title="Employee of the Month ⭐" icon={Award} gradient="from-yellow-400 to-yellow-600">
          <EmployeeCard employee={data.bestEmployee} showDate={false} type="bestEmployee" />
        </PreviewSection>
      )}

      {data.bestPerformer && (
        <PreviewSection title="Best Performer 🏆" icon={Star} gradient="from-amber-500 to-amber-700">
          <EmployeeCard employee={data.bestPerformer} showDate={false} type="bestPerformer" />
        </PreviewSection>
      )}

      {data.exitingEmployees.length > 0 && (
        <PreviewSection title="Farewell & Best Wishes" icon={LogOut} gradient="from-gray-500 to-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.exitingEmployees.slice().reverse().map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} type="exitingEmployees" />
            ))}
          </div>
        </PreviewSection>
      )}
    </>
  );
}

