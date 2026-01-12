'use client';

import React from 'react';
import Image from 'next/image';
import { CARD_CONFIG } from './cardConfig';
import { generatePromotionsBlurb } from './cardContent';
import type { Employee } from '@/types/newsletter';
import { EmployeeCard } from './EmployeeCard';

interface PromotionsCardProps {
  employees: Employee[];
}

export function PromotionsCard({ employees }: PromotionsCardProps) {
  const config = CARD_CONFIG.promotions;
  if (!employees || employees.length === 0) return null;

  if (employees.length === 1) {
    return <EmployeeCard employee={employees[0]} type="promotions" />;
  }

  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
      <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="font-serif text-2xl font-extrabold leading-tight text-slate-900 mb-4">Promotions</h3>

        <p className="mb-4 text-slate-600">{generatePromotionsBlurb(employees)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map(emp => {
            const photo = (() => {
              try {
                // lazy require to avoid SSR window access
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { safeImageSrc } = require('./imageUtils');
                return safeImageSrc(emp.photoUrl);
              } catch {
                return undefined;
              }
            })();

            return (
              <div key={emp.id} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                  {photo ? (
                    <Image src={photo} alt={emp.name} width={48} height={48} className="rounded-lg object-cover" />
                  ) : (
                    <span className={`text-xl font-bold bg-linear-to-br ${config.gradient} bg-clip-text text-transparent`}>{emp.name.charAt(0)}</span>
                  )}
                </div>

              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-800">{emp.name}</h4>
                <p className="mt-1 text-sm text-slate-700">{(() => {
                  if (emp.previousPosition || emp.previousDepartment) {
                    const prevPos = emp.previousPosition ?? 'role not provided';
                    const prevDept = emp.previousDepartment ?? (emp.department ?? 'department not provided');
                    const newPos = emp.position ?? 'role not provided';
                    const newDept = emp.department ?? 'department not provided';
                    return `${emp.name} was ${prevPos}${emp.previousDepartment ? ` in ${prevDept}` : ''} and is now ${newPos}${emp.department ? ` in ${newDept}` : ''}`;
                  }

                  // fallback: short summary (keep date on its own line)
                  const pos = emp.position ? emp.position : 'role not provided';
                  const dept = emp.department ? ` in ${emp.department}` : '';
                  return `${emp.name} — ${pos}${dept}`;
                })()}
                {emp.date && (
                  <span className="mt-1 text-sm text-slate-500"> effective on {new Date(emp.date).toLocaleDateString()}</span>
                )}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
