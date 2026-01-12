import React from 'react';
import { Users, TrendingUp, Briefcase, Cake, Calendar, Award, Star, LogOut, Heart } from 'lucide-react';


export type CardType = 'newHires' | 'promotions' | 'transfers' | 'birthdays' | 'anniversaries' | 'events' | 'bestEmployee' | 'bestPerformer' | 'exitingEmployees';

export const CARD_CONFIG: Record<CardType, {
  label: string;
  icon: React.ReactNode;
  theme: string;
  accent: string;
  gradient: string;
  guidance?: string;
}> = {
  newHires: {
    label: 'Welcome Aboard!',
    icon: <Users size={18} />,
    theme: 'border-blue-200 bg-blue-50/50',
    accent: 'text-blue-600',
    gradient: 'from-blue-600 to-indigo-600',
    guidance: 'List newly hired employees with full name, position (job title), and department. If a field is missing, state "role not provided" or "department not provided" rather than inventing data. Keep the message concise and factual.'
  },
  promotions: {
    label: 'Career Milestone',
    icon: <TrendingUp size={18} />,
    theme: 'border-emerald-200 bg-emerald-50/50',
    accent: 'text-emerald-600',
    gradient: 'from-emerald-600 to-teal-600',
    guidance: 'State the employee’s name, previous role (if available), new role (position), and department. If any field is missing, use neutral phrasing (e.g. "role not provided"). Use celebratory yet professional language and be specific about the role change.'
  },
  transfers: {
    label: 'Internal Move',
    icon: <Briefcase size={18} />,
    theme: 'border-indigo-200 bg-indigo-50/50',
    accent: 'text-indigo-600',
    gradient: 'from-indigo-600 to-violet-600',
    guidance: 'Mention the employee’s name, previous department/branch and the new department/assignment. Include effective date if available. If a field is missing, use neutral phrasing and do not invent details.'
  },
  birthdays: {
    label: 'HBD Spotlight!',
    icon: <Cake size={18} />,
    theme: 'border-pink-200 bg-pink-50/50',
    accent: 'text-pink-600',
    gradient: 'from-pink-600 to-rose-500',
    guidance: 'List employee names and birthday dates. Use friendly, celebratory language. Do not include ages. If department or position is present and relevant, include it succinctly (e.g. "Jane Doe, Product Manager").'
  },
  anniversaries: {
    label: 'Work Anniversary',
    icon: <Heart size={18} />,
    theme: 'border-purple-200 bg-purple-50/50',
    accent: 'text-purple-600',
    gradient: 'from-purple-600 to-fuchsia-600',
    guidance: 'Highlight employee names, years of service (if available), and department. Use appreciative and factual language. If years are not available, avoid guessing and use neutral phrasing.'
  },
  events: {
    label: 'Happening Soon',
    icon: <Calendar size={18} />,
    theme: 'border-orange-200 bg-orange-50/50',
    accent: 'text-orange-600',
    gradient: 'from-orange-500 to-amber-500',
    guidance: 'Display event name, date, location, and a concise purpose or "why attend" line. Keep descriptions short and factual; do not add promotional claims or fabricate details.'
  },
  bestEmployee: {
    label: 'Employee of the Month',
    icon: <Award size={18} />,
    theme: 'border-yellow-300 bg-yellow-50/80 shadow-yellow-100 shadow-xl',
    accent: 'text-yellow-700',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    guidance: 'Feature the employee’s full name, position, department, and a short, specific reason for recognition (performance, results, or values). Keep it factual and avoid generic or unverifiable claims.'
  },
  bestPerformer: {
    label: 'Top Performer',
    icon: <Star size={18} />,
    theme: 'border-cyan-200 bg-cyan-50/50',
    accent: 'text-cyan-600',
    gradient: 'from-cyan-600 to-blue-500',
    guidance: 'Highlight exceptional performance by stating the employee’s name, position, department, and the measurable achievement if provided. Avoid exaggeration.'
  },
  exitingEmployees: {
    label: 'Bon Voyage',
    icon: <LogOut size={18} />,
    theme: 'border-slate-200 bg-slate-50/50',
    accent: 'text-slate-600',
    gradient: 'from-slate-600 to-slate-800',
    guidance: 'Mention the employee’s name, position, department, and last working day if available. Use respectful, appreciative language and avoid speculation about reasons for leaving.'
  },
};
