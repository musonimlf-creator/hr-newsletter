'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Sparkles, ArrowRight, Quote, Trophy } from 'lucide-react';
import type { Employee } from '@/types/newsletter';
import { CARD_CONFIG, CardType } from './cardConfig';

interface EmployeeCardProps {
  employee: Employee | null;
  showDate?: boolean;
  type?: CardType;
}

export function EmployeeCard({ employee, showDate = true, type = 'newHires' }: EmployeeCardProps) {
  if (!employee) return null;
  const config = CARD_CONFIG[type];
  const isBest = type === 'bestEmployee' || type === 'bestPerformer';
  const isAnniversary = type === 'anniversaries';

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border-2 ${config.theme} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}> 
      {/* Accent bar */}
      <div className={`h-2 w-full bg-linear-to-r ${config.gradient}`}></div>

      {/* Badge */}
      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-linear-to-r ${config.gradient} shadow-lg shadow-black/10`}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      <div className="flex h-full flex-col p-8 md:p-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative shrink-0">
              <div className={`h-28 w-28 overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-linear-to-br ${config.gradient} flex items-center justify-center p-1`}>
                <div className="h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                  {employee.photoUrl ? (
                    <Image src={employee.photoUrl} alt={employee.name} width={112} height={112} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <span className={`text-4xl font-black bg-linear-to-br ${config.gradient} bg-clip-text text-transparent`}>{employee.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              {isBest && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-yellow-400 p-2 text-white shadow-lg ring-4 ring-white">
                  <Trophy size={16} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">{employee.name}</h3>
              {/* detail sentence */}
              <p className="mt-2 text-lg font-medium text-slate-700">{(() => {
                // promotions take precedence: prefer "was ... and is now ..." when prior info exists
                if (employee.previousPosition || employee.previousDepartment) {
                  const prevPos = employee.previousPosition ?? 'role not provided';
                  const prevDept = employee.previousDepartment ?? (employee.department ?? 'department not provided');
                  const newPos = employee.position ?? 'role not provided';
                  const newDept = employee.department ?? 'department not provided';
                  return `${employee.name} was ${prevPos}${employee.previousDepartment ? ` in ${prevDept}` : ''} and is now ${newPos}${employee.department ? ` in ${newDept}` : ''}.`;
                }

                // transfers: if we have explicit from/to positions prefer "was ... and is now ...", otherwise keep department-only phrasing
                if (employee.fromPosition || employee.toPosition) {
                  const date = employee.date ? `, effective ${new Date(employee.date).toLocaleDateString()}` : '';
                  const fromPos = employee.fromPosition ?? 'role not provided';
                  const fromDept = employee.fromDepartment ?? 'department not provided';
                  const toPos = employee.toPosition ?? 'role not provided';
                  const toDept = employee.toDepartment ?? 'department not provided';
                  return `${employee.name} was ${fromPos}${employee.fromDepartment ? ` in ${fromDept}` : ''} and is now ${toPos}${employee.toDepartment ? ` in ${toDept}` : ''}${date}.`;
                }

                if (employee.fromDepartment && employee.toDepartment) {
                  const date = employee.date ? ` effective ${new Date(employee.date).toLocaleDateString()}` : '';
                  return `${employee.name} is transferring from ${employee.fromDepartment} to ${employee.toDepartment}${date}.`;
                }

                const position = employee.position ? `a ${employee.position}` : 'a role not provided';
                const dept = employee.department ? ` in ${employee.department}` : '';
                return `${employee.name} is ${position}${dept}.`;
              })()}</p>
            </div>
          </div>

          {/* Blurb (plain informational text) */}
          {employee.blurb && (
            <div className="relative mt-2">
              <p className="relative z-10 text-lg leading-relaxed text-slate-600 pl-0">{employee.blurb}</p>
            </div>
          )}

          {/* Achievement */}
          {employee.achievement && (
            <div className={`mt-2 rounded-3xl border bg-white p-6 shadow-sm ${config.theme}`}>
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-2xl p-3 text-white bg-linear-to-br ${config.gradient}`}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{isAnniversary ? 'Milestone Memory' : 'Key Contribution'}</h4>
                  <p className="text-base font-medium leading-relaxed text-slate-700">{employee.achievement}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-10 flex items-center justify-start">
          {showDate && employee.date && (
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Calendar size={12} />
              {new Date(employee.date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
