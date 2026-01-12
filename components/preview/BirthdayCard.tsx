'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import type { Employee } from '@/types/newsletter';
import { CARD_CONFIG } from './cardConfig';

interface BirthdayCardProps {
  employees: Employee[];
}

function formatDateShort(date?: string) {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return date;
  }
}

function generateBirthdayBlurb(emps: Employee[]) {
  if (emps.length === 0) return '';
  if (emps.length === 1) {
    const e = emps[0];
    const date = formatDateShort(e.date);
    const position = e.position ? `, ${e.position}` : '';
    const dept = e.department ? ` (${e.department})` : '';
    // Keep message friendly and factual — do not invent ages or unprovided details
    return date
      ? `Please join us in wishing ${e.name}${position}${dept} a very happy birthday on ${date}.`
      : `Please join us in wishing ${e.name}${position}${dept} a very happy birthday.`;
  }

  // Multiple: produce a concise, readable listing of names with dates (no ages)
  const items = emps.map(e => {
    const date = formatDateShort(e.date);
    const dept = e.department ? ` — ${e.department}` : '';
    return date ? `${e.name} (${date})${dept}` : `${e.name}${dept}`;
  });

  const MAX_LIST = 8; // show up to this many names inline, then indicate there are more
  if (items.length <= MAX_LIST) {
    return `Upcoming birthdays: ${items.join(', ')}.`;
  }

  const shown = items.slice(0, MAX_LIST).join(', ');
  const remaining = items.length - MAX_LIST;
  return `Upcoming birthdays: ${shown}, and ${remaining} more. See details below.`;
}

export function BirthdayCard({ employees }: BirthdayCardProps) {
  const config = CARD_CONFIG.birthdays;

  if (!employees || employees.length === 0) return null;

  // Single employee: render the existing full Employee card style
  if (employees.length === 1) {
    const e = employees[0];
    return (
      <div className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}> 
        <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>
        <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
          {config.icon}
          <span>{config.label}</span>
        </div>

        <div className="flex h-full flex-col p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative shrink-0">
              <div className={`h-28 w-28 overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-linear-to-br ${config.gradient} flex items-center justify-center p-1`}>
                <div className="h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                  {(() => {
                    const photo = (() => {
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const { safeImageSrc } = require('./imageUtils');
                        return safeImageSrc(e.photoUrl);
                      } catch {
                        return undefined;
                      }
                    })();

                    return photo ? (
                      // Image optimized with next/image
                      <Image src={photo} alt={e.name} width={112} height={112} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span className={`text-4xl font-black bg-linear-to-br ${config.gradient} bg-clip-text text-transparent`}>{e.name.charAt(0)}</span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">{e.name}</h3>
              
              <p className="mt-6 text-xl leading-relaxed text-slate-600 font-medium">{generateBirthdayBlurb([e])}</p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm border border-slate-100">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-white bg-linear-to-br ${config.gradient}`}>
                    <Calendar size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{formatDateShort(e.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple birthdays: distinct layout for lists — compact header + scrollable details
  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
      <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-extrabold leading-tight text-slate-900">Upcoming Birthdays</h3>
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 bg-white text-sm font-bold ${config.accent}`}>
            <span className="text-slate-800">{employees.length}</span>
            <span className="text-slate-500">people</span>
          </div>
        </div>

        <p className="mb-4 text-slate-600">{generateBirthdayBlurb(employees)}</p>

        <div className="max-h-64 overflow-auto">
          <ul className="space-y-3">
            {employees.map(emp => {
                const photo = (() => {
                  try {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { safeImageSrc } = require('./imageUtils');
                    return safeImageSrc(emp.photoUrl);
                  } catch {
                    return undefined;
                  }
                })();

                return (
              <li key={emp.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                    {photo ? (
                      <Image src={photo} alt={emp.name} width={48} height={48} className="rounded-lg object-cover" />
                    ) : (
                      <span className={`text-xl font-bold bg-linear-to-br ${config.gradient} bg-clip-text text-transparent`}>{emp.name.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-800">{emp.name}</h4>
                    <p className="mt-1 text-sm text-slate-700">{emp.position ? ` ${emp.position}` : 'Role not provided'}{emp.department ? ` in ${emp.department} Department` : ''}{emp.date ? ` and will be celebrating the birthday on ${formatDateShort(emp.date)}` : ''}</p>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </div>
  );
}
