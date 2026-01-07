'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Employee, CategoryKey } from '@/types/newsletter';

interface EmployeeFormProps {
  employee: Employee;
  category: CategoryKey;
  showFromTo?: boolean;
  showAchievement?: boolean;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export function EmployeeForm({
  employee,
  category,
  showFromTo = false,
  showAchievement = false,
  onUpdate,
  onRemove
}: EmployeeFormProps) {
  return (
    <div style={{ borderColor: '#C2A2CB' }} className="bg-white backdrop-blur-sm p-5 rounded-2xl border-2 mb-4 hover:shadow-lg transition-all duration-300" onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6E3371'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#C2A2CB'}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div style={{ background: 'linear-gradient(to bottom right, #52275A, #FFD058)' }} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
          </div>
          <span style={{ color: '#52275A' }} className="text-sm font-medium">Employee Details</span>
        </div>
        <button
          onClick={() => onRemove(employee.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="url"
          placeholder="Photo URL (optional)"
          value={employee.photoUrl || ''}
          onChange={(e) => onUpdate(employee.id, 'photoUrl', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={employee.name}
          onChange={(e) => onUpdate(employee.id, 'name', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <input
          type="text"
          placeholder="Position"
          value={employee.position}
          onChange={(e) => onUpdate(employee.id, 'position', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <input
          type="text"
          placeholder="Department"
          value={employee.department}
          onChange={(e) => onUpdate(employee.id, 'department', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <input
          type="date"
          value={employee.date || ''}
          onChange={(e) => onUpdate(employee.id, 'date', e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        
        {showFromTo && (
          <>
            <input
              type="text"
              placeholder="From Department"
              value={employee.fromDepartment || ''}
              onChange={(e) => onUpdate(employee.id, 'fromDepartment', e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="To Department"
              value={employee.toDepartment || ''}
              onChange={(e) => onUpdate(employee.id, 'toDepartment', e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </>
        )}
        
        {showAchievement && (
          <textarea
            placeholder="Achievement/Recognition"
            value={employee.achievement || ''}
            onChange={(e) => onUpdate(employee.id, 'achievement', e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 w-full col-span-1 md:col-span-2 h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        )}
      </div>
    {/* Comments Section */}
    <div className="mt-4 border-t border-primary-100 pt-4">
      <h4 className="text-sm font-semibold text-primary-500 mb-2">Internal Notes / Comments:</h4>
      <div className="space-y-2 mb-2">
        {employee.comments && employee.comments.length > 0 ? (
          employee.comments.map((comment) => (
            <div key={comment.id} className="bg-primary-50 p-2 rounded-md border border-primary-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary-400">{comment.user}</span>
                <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleString()}</span>
              </div>
              <div className="mt-1">{comment.content}</div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400">No comments yet.</div>
        )}
      </div>
      <form onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); const content = fd.get('content')?.toString().trim() || ''; if (content) { onUpdate(employee.id, 'comments', JSON.stringify([...(employee.comments ?? []), { id: Date.now().toString(), user: 'Editor', content, date: new Date().toISOString() }])); form.reset(); } }} className="flex gap-2">
        <input name="content" className="flex-1 border border-primary-100 rounded-xl px-3 py-2 text-sm" placeholder="Add a comment..." autoComplete="off" />
        <button type="submit" className="px-3 py-2 bg-primary-400 text-white rounded-xl font-medium hover:bg-primary-500 transition">Add</button>
      </form>
    </div>
  </div>
  );
}