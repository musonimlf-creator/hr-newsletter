import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// Mock next/image to avoid Next.js specific behavior in tests
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));

import { PromotionsCard } from '../components/preview/PromotionsCard';

const sampleEmployee = (overrides: Record<string, any> = {}) => ({
  id: '1',
  name: 'Alice Example',
  position: 'Engineer',
  department: 'Engineering',
  photoUrl: undefined,
  date: '2026-01-15',
  ...overrides,
});

describe('PromotionsCard component', () => {
  it('shows effective date in fallback summary when present', () => {
    const emp = sampleEmployee({ date: '2026-01-15', previousPosition: undefined, previousDepartment: undefined });
    const other = sampleEmployee({ id: '2', name: 'Bob Example', position: 'PM' });
    const html = renderToStaticMarkup(<PromotionsCard employees={[emp, other]} />);
    expect(html).toContain(`effective on ${new Date(emp.date).toLocaleDateString()}`);
  });
});
