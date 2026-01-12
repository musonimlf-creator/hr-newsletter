import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// Mock next/image
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));

import { NewHiresCard } from '../components/preview/NewHiresCard';

const sampleEmployee = (overrides: Record<string, any> = {}) => ({
  id: '1',
  name: 'Patricia Mbewe',
  position: 'HR Assistant',
  department: 'Human Resources',
  photoUrl: undefined,
  date: '2026-01-15',
  blurb: 'They will support HR onboarding and employee relations.',
  ...overrides,
});

describe('NewHiresCard component', () => {
  it('renders per-person blurb on small cards when provided', () => {
    const employees = [
      sampleEmployee(),
      sampleEmployee({ id: '2', name: 'Blessings Gondwe', position: 'IT Support Officer', department: 'IT', blurb: 'They will be on the service desk and hardware support.' }),
    ];

    const html = renderToStaticMarkup(<NewHiresCard employees={employees} />);
    expect(html).toContain('They will support HR onboarding and employee relations.');
    expect(html).toContain('They will be on the service desk and hardware support.');
  });
});