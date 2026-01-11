export interface EmployeeComment {
  id: string;
  user: string;
  content: string;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  date?: string;
  achievement?: string;
  // For transfers
  fromDepartment?: string;
  toDepartment?: string;
  fromPosition?: string;
  toPosition?: string;
  // For promotions: previous role/department (optional)
  previousPosition?: string;
  previousDepartment?: string;
  comments?: EmployeeComment[];
  // Optional fields used in various cards
  blurb?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
}

export interface NewsletterData {
  month: string;
  year: string;
  newHires: Employee[];
  promotions: Employee[];
  transfers: Employee[];
  birthdays: Employee[];
  anniversaries: Employee[];
  events: Event[];
  bestEmployee: Employee | null;
  bestPerformer: Employee | null;
  exitingEmployees: Employee[];
}

export type ViewMode = 'editor' | 'preview';

export type CategoryKey = keyof Omit<NewsletterData, 'month' | 'year'>;

import type { ReactNode } from 'react';

export interface EditorSectionProps {
  title: string;
  // Icon should be a component that accepts className/size for consistent usage
  icon: React.ComponentType<{ className?: string; size?: number }>; 
  category: CategoryKey;
  items: Employee[] | Event[] | Employee | null;
  showFromTo?: boolean;
  showAchievement?: boolean;
  isSingle?: boolean;
  color?: string;
}