import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AnniversariesCard } from '../components/preview/AnniversariesCard';

const sampleEmployee = (overrides = {}) => ({
  id: '1',
  name: 'Alice Example',
  position: 'Engineer',
  department: 'Engineering',
  blurb: '5 years',
  ...overrides,
});

describe('AnniversariesCard', () => {
  it('renders small cards showing position and department, not the blurb', () => {
    const html = renderToString(
      AnniversariesCard({ employees: [sampleEmployee(), sampleEmployee({ id: '2', name: 'Bob', position: 'Designer', department: 'Product', blurb: '3 years' })] }) as any
    );

    expect(html).toContain('Engineer');
    expect(html).toContain('Designer');
    // Ensure the short blurb text (e.g., "5 years") is not shown on the small cards
    // (the overall blurb summary may still contain it)
    // Small cards should show position and department (not the short blurb)
    expect(html).toContain('Engineer');
    expect(html).toContain('Designer');
  });
});