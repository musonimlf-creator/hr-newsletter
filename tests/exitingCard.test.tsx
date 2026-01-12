import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// Mock next/image
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));

import { EmployeeCard } from '../components/preview/EmployeeCard';

const sampleEmployee = (overrides: Record<string, any> = {}) => ({
  id: '1',
  name: 'Blessings Gondwe',
  position: 'IT Support Officer',
  department: 'IT',
  photoUrl: undefined,
  date: '2026-01-15',
  blurb: 'We wish them all the best.',
  ...overrides,
});

describe('EmployeeCard (exiting) blurb sanitization', () => {
  it('removes leading full name from the blurb when present', () => {
    const emp = sampleEmployee({ blurb: 'Blessings Gondwe, we wish you all the best.' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="exitingEmployees" />);

    // The page should still show the name once (as the heading)
    expect(html).toContain('Blessings Gondwe');

    // The blurb should be present but should not repeat the name at the start
    expect(html).toContain('we wish you all the best.');
    expect(html).not.toContain('Blessings Gondwe, we wish you all the best.');
  });

  it('removes the name when it follows a leading farewell phrase (e.g., "Farewell Blessings Gondwe")', () => {
    const emp = sampleEmployee({ blurb: 'Farewell Blessings Gondwe' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="exitingEmployees" />);

    expect(html).toContain('Farewell');
    expect(html).not.toContain('Farewell Blessings Gondwe');
  });

  it('keeps non-repeating blurbs intact', () => {
    const emp = sampleEmployee({ blurb: 'Wishing you success in your next chapter.' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="exitingEmployees" />);

    expect(html).toContain('Wishing you success in your next chapter.');
  });

  it('renders a sensible farewell sentence for single exiting employee without repeating the name', () => {
    const emp = sampleEmployee({ name: 'Prisca Mvula', blurb: undefined, position: 'Credit Administrator', department: 'Credit', date: '2026-01-23' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="exitingEmployees" />);

    // Heading contains the name once
    expect(html).toContain('Prisca Mvula');

    // Detail sentence should not repeat the name but should contain a farewell phrase
    expect(html).toContain('Former Credit Administrator in the Credit');
    expect(html).toContain('We thank them for their contributions and wish them well');
    expect(html).not.toContain('Prisca Mvula is');
  });
});
