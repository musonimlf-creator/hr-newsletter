'use client';

import React from 'react';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';
import type { Employee } from '@/types/newsletter';

interface EmployeeCardProps {
  employee: Employee;
  showDate?: boolean;
}

export function EmployeeCard({ employee, showDate = true }: EmployeeCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-gray-100 hover:border-primary-200">
      <div className="flex items-start gap-6">
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-md shrink-0 overflow-hidden border-2 border-gray-100"
          style={
            employee.photoUrl
              ? { backgroundColor: 'transparent' }
              : { background: 'linear-gradient(to bottom right, #52275A, #FFD058)' }
          }
        >
          {employee.photoUrl ? (
            <img
              src={employee.photoUrl}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            employee.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 pt-1">
          <h4 className="font-serif font-bold text-2xl text-gray-900 mb-1 leading-tight">{employee.name}</h4>
          <p className="text-primary-600 font-semibold mb-1 text-lg">{employee.position}</p>
          <p className="text-sm text-primary-400 mb-2 font-medium">{employee.department}</p>
          
          {showDate && employee.date && (
            <p className="text-sm text-accent-300 font-bold mt-3 flex items-center gap-2">
              <Calendar size={16} className="text-accent-200" />
              {new Date(employee.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
          
          {employee.achievement && (
            <div className="mt-3 p-3 bg-accent-50 rounded-xl border-2 border-accent-200">
              <p className="text-sm text-primary-600 font-medium flex items-start gap-2">
                <Sparkles size={16} className="text-accent-200 flex-shrink-0 mt-0.5" />
                <span>{employee.achievement}</span>
              </p>
            </div>
          )}
          
          {employee.fromDepartment && employee.toDepartment && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-primary-200 text-primary-600 rounded-lg font-bold">
                {employee.fromDepartment}
              </span>
              <TrendingUp size={16} className="text-primary-500" />
              <span className="px-3 py-1 bg-accent-100 text-primary-600 rounded-lg font-bold">
                {employee.toDepartment}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
