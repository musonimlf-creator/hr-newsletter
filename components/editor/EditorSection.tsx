'use client';

import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { EventForm } from './EventForm';
import type { EditorSectionProps } from '@/types/newsletter';
import type { Employee, Event } from '@/types/newsletter';

interface EditorSectionPropsExtended extends EditorSectionProps {
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id?: string) => void;
}

export function EditorSection({
  title,
  icon: Icon,
  category,
  items,
  showFromTo = false,
  showAchievement = false,
  isSingle = false,
  color = 'purple',
  onAdd,
  onUpdate,
  onRemove
}: EditorSectionPropsExtended) {
  const hasItems = isSingle ? items !== null : Array.isArray(items) && items.length > 0;

  return (
    <div style={{ borderColor: '#E7DBEE' }} className="bg-white p-6 rounded-3xl shadow-md mb-6 border-2 hover:border-purple-500 transition-all duration-300" onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6E3371'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E7DBEE'}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div style={{ background: 'linear-gradient(to bottom right, #52275A, #FFD058)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="text-white" size={24} />
          </div>
          <div>
            <h3 style={{ color: '#52275A' }} className="text-xl font-bold">{title}</h3>
            {hasItems && (
              <span className="text-sm text-gray-500">
                {isSingle ? '1 entry' : `${Array.isArray(items) ? items.length : 0} ${Array.isArray(items) && items.length === 1 ? 'entry' : 'entries'}`}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={onAdd}
          style={{ background: 'linear-gradient(to right, #52275A, #6E3371)', color: '#FFFFFF' }}
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-xl transition-all transform hover:scale-105 hover:opacity-90 ${
            isSingle && items !== null ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSingle && items !== null}
          type="button"
        >
          <Plus size={18} />
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {category === 'events' ? (
          Array.isArray(items) && items.length === 0 ? (
            <div style={{ backgroundColor: '#E7DBEE', borderColor: '#6E3371' }} className="text-center py-12 rounded-2xl border-2 border-dashed">
              <Calendar style={{ color: '#52275A' }} className="mx-auto mb-3" size={48} />
              <p style={{ color: '#52275A' }} className="font-semibold">No events added yet</p>
              <p style={{ color: '#6E3371' }} className="text-sm mt-1 font-medium">Click "Add" to create an event</p>
            </div>
          ) : (
            Array.isArray(items) && (items as Event[]).map((event: Event) => (
              <EventForm
                key={event.id}
                event={event}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))
          )
        ) : isSingle ? (
          items ? (
            <EmployeeForm
              employee={items as Employee}
              category={category}
              showAchievement={showAchievement}
              onUpdate={onUpdate}
              onRemove={() => onRemove()}
            />
          ) : (
            <div style={{ backgroundColor: '#E7DBEE', borderColor: '#6E3371' }} className="text-center py-12 rounded-2xl border-2 border-dashed">
              <Icon style={{ color: '#52275A' }} className="mx-auto mb-3" size={48} />
              <p style={{ color: '#52275A' }} className="font-semibold">No employee added yet</p>
              <p style={{ color: '#6E3371' }} className="text-sm mt-1 font-medium">Click "Add" to select an employee</p>
            </div>
          )
        ) : Array.isArray(items) && items.length === 0 ? (
          <div style={{ backgroundColor: '#E7DBEE', borderColor: '#6E3371' }} className="text-center py-12 rounded-2xl border-2 border-dashed">
            <Icon style={{ color: '#52275A' }} className="mx-auto mb-3" size={48} />
            <p style={{ color: '#52275A' }} className="font-semibold">No employees added yet</p>
            <p style={{ color: '#6E3371' }} className="text-sm mt-1 font-medium">Click "Add" to create an entry</p>
          </div>
        ) : (
          Array.isArray(items) && (items as Employee[]).map((employee: Employee) => (
            <EmployeeForm
              key={employee.id}
              employee={employee}
              category={category}
              showFromTo={showFromTo}
              showAchievement={showAchievement}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}