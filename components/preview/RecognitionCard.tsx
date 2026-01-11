'use client';

import React from 'react';
import { CARD_CONFIG } from './cardConfig';
import { generateRecognitionBlurb } from './cardContent';
import type { Employee } from '@/types/newsletter';
import { EmployeeCard } from './EmployeeCard';

interface RecognitionCardProps {
  employee: Employee | null;
  label: 'Employee of the Month' | 'Best Performer' | string;
}

export function RecognitionCard({ employee, label }: RecognitionCardProps) {
  const config = label === 'Best Performer' ? CARD_CONFIG.bestPerformer : CARD_CONFIG.bestEmployee;
  if (!employee) return null;

  if (employee) {
    return <EmployeeCard employee={employee} type={label === 'Best Performer' ? 'bestPerformer' : 'bestEmployee'} />;
  }

  return null;
}
