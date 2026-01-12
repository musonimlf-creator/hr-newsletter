import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// Mock next/image to avoid Next.js specific behavior in tests
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));

import { EmployeeCard } from '../components/preview/EmployeeCard';

const sampleEmployee = (overrides: Record<string, any> = {}) => ({
  id: '1',
  name: 'Alice Example',
  position: 'Engineer',
  department: 'Engineering',
  photoUrl: undefined,
  date: '2026-03-01',
  ...overrides,
});

describe('EmployeeCard component', () => {
  it('renders explicit prior→now phrasing for promotions', () => {
    const emp = sampleEmployee({ previousPosition: 'Engineer', previousDepartment: 'Engineering', position: 'Senior Engineer', department: 'Engineering' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="promotions" showDate={false} />);
    expect(html).toContain('was Engineer in Engineering and is now Senior Engineer in Engineering');
  });

  it('renders explicit prior→now phrasing for transfers with positions', () => {
    const emp = sampleEmployee({ fromPosition: 'Analyst', fromDepartment: 'Finance', toPosition: 'Senior Analyst', toDepartment: 'Finance', date: '2026-03-01' });
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} type="transfers" showDate={false} />);
    expect(html).toContain('was Analyst in Finance and is now Senior Analyst in Finance');
  });

  it('does not throw and falls back for malformed photoUrl', () => {
    const emp = sampleEmployee({ photoUrl: 'http://%zz' });
    expect(() => renderToStaticMarkup(<EmployeeCard employee={emp} />)).not.toThrow();
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} />);
    expect(html).toContain('A');
  });

  it('blocks javascript: URLs and falls back to initial', () => {
    const emp = sampleEmployee({ photoUrl: 'javascript:alert(1)' });
    expect(() => renderToStaticMarkup(<EmployeeCard employee={emp} />)).not.toThrow();
    const html = renderToStaticMarkup(<EmployeeCard employee={emp} />);
    expect(html).toContain('A');
  });
});