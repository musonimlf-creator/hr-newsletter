import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { EmployeeCard } from '../components/preview/EmployeeCard';

const sampleEmployee = (overrides = {}) => ({
  id: '1',
  name: 'Alex Star',
  position: 'Lead Engineer',
  department: 'Engineering',
  achievement: 'Led migration',
  ...overrides,
});

describe('Best Employee / Best Performer card', () => {
  it('shows position and department under the name and does not render verbose detail sentence', () => {
    const emp = sampleEmployee();
    const html = renderToString(EmployeeCard({ employee: emp, type: 'bestEmployee' }) as any);
    expect(html).toContain('Lead Engineer');
    expect(html).toContain('Engineering');
    // Ensure the previous fallback sentence like "Alex Star is a ..." is not present
    expect(html).not.toContain(`${emp.name} is `);
  });
});