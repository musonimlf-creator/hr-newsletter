'use client';

import React from 'react';
import Image from 'next/image';
import { CARD_CONFIG } from './cardConfig';
import { generateAnniversariesBlurb } from './cardContent';
import type { Employee } from '@/types/newsletter';
import { EmployeeCard } from './EmployeeCard';

interface AnniversariesCardProps {
  employees: Employee[];
}

export function AnniversariesCard({ employees }: AnniversariesCardProps) {
  const config = CARD_CONFIG.anniversaries;
  if (!employees || employees.length === 0) return null;

  if (employees.length === 1) {
    return <EmployeeCard employee={employees[0]} type="anniversaries" />;
  }

  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
      <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="font-serif text-2xl font-extrabold leading-tight text-slate-900 mb-4">Work Anniversaries</h3>

        <p className="mb-4 text-slate-600">{generateAnniversariesBlurb(employees)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map(emp => (
            <div key={emp.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                {emp.photoUrl ? (
                  <Image src={emp.photoUrl} alt={emp.name} width={48} height={48} className="rounded-lg object-cover" />
                ) : (
                  <span className={`text-xl font-bold bg-linear-to-br ${config.gradient} bg-clip-text text-transparent`}>{emp.name.charAt(0)}</span>
                )}
              </div>

              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-800">{emp.name}</h4>
                <p className="mt-1 text-sm text-slate-700">{emp.blurb ?? ''}{emp.department ? ` — ${emp.department}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
