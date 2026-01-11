import { describe, it, expect } from 'vitest';
import {
  generateNewHiresBlurb,
  generatePromotionsBlurb,
  generateTransfersBlurb,
  generateAnniversariesBlurb,
  generateEventsBlurb,
  generateRecognitionBlurb,
  generateExitingBlurb,
} from '../components/preview/cardContent';

const sampleEmployee = (overrides = {}) => ({
  id: '1',
  name: 'Alice Example',
  position: 'Engineer',
  department: 'Engineering',
  date: '01 Feb 2026',
  ...overrides,
});

describe('cardContent helpers', () => {
  it('new hires single and multiple', () => {
    expect(generateNewHiresBlurb([sampleEmployee()])).toContain('Please join us in welcoming Alice Example');
    const m = generateNewHiresBlurb([sampleEmployee({ name: 'A' }), sampleEmployee({ name: 'B' })]);
    expect(m).toContain('Welcome 2 new team members');

    // multiple hires now include position + department inline in the summary
    const m2 = generateNewHiresBlurb([
      sampleEmployee({ name: 'Patricia Mbewe', position: 'HR Assistant', department: 'Human Resources' }),
      sampleEmployee({ name: 'Blessings Gondwe', position: 'IT Support Officer', department: 'IT' }),
    ]);
    expect(m2).toContain('Patricia Mbewe — HR Assistant in Human Resources');
    expect(m2).toContain('Blessings Gondwe — IT Support Officer in IT');
  });

  it('promotions handles single and multiple and uses prior→now phrasing when available', () => {
    // simple promotion message when only new role is present
    expect(generatePromotionsBlurb([sampleEmployee({ position: 'Senior Engineer' })])).toContain('has been promoted to Senior Engineer');

    // explicit prior → now when previousPosition/previousDepartment are provided
    const p = generatePromotionsBlurb([
      sampleEmployee({ position: 'Senior Engineer', previousPosition: 'Engineer', previousDepartment: 'Engineering' }),
    ]);
    expect(p).toContain('was Engineer in Engineering and is now Senior Engineer in Engineering');

    const m = generatePromotionsBlurb([sampleEmployee({ name: 'A' }), sampleEmployee({ name: 'B' })]);
    expect(m).toContain('Congratulations to 2 colleagues');
  });

  it('transfers show from → to and use prior→now phrasing when available', () => {
    // simple department-only transfer
    expect(generateTransfersBlurb([sampleEmployee({ fromDepartment: 'A', toDepartment: 'B', date: '10 Feb' })])).toContain('transferring from A to B');

    // explicit prior → now when from/to positions and departments are provided
    const t = generateTransfersBlurb([
      sampleEmployee({ fromPosition: 'Analyst', fromDepartment: 'Finance', toPosition: 'Senior Analyst', toDepartment: 'Finance', date: '01 Mar 2026' }),
    ]);
    expect(t).toContain('was Analyst in Finance and is now Senior Analyst in Finance');

    const m = generateTransfersBlurb([sampleEmployee({ name: 'A' }), sampleEmployee({ name: 'B' })]);
    expect(m).toContain('Employee transfers (2)');
  });

  it('anniversaries show years when found in blurb', () => {
    const single = sampleEmployee({ blurb: '5 years' });
    expect(generateAnniversariesBlurb([single])).toContain('5 years');
    const m = generateAnniversariesBlurb([sampleEmployee(), sampleEmployee({ name: 'B', blurb: '3 years' })]);
    expect(m).toContain('Work anniversaries');
  });

  it('events list concisely', () => {
    const ev = { id: 'e1', title: 'Training', date: '20 Feb 2026', description: 'Desc', location: 'HQ' };
    expect(generateEventsBlurb([ev])).toContain('Training on 20 Feb 2026');
    const m = generateEventsBlurb([ev, { ...ev, id: 'e2', title: 'Team' }]);
    expect(m).toContain('Upcoming events (2)');
  });

  it('recognition returns name with achievement', () => {
    const e = sampleEmployee({ achievement: 'Top performer' });
    expect(generateRecognitionBlurb(e, 'Best Performer')).toContain('Top performer');
  });

  it('exiting employees show last day', () => {
    const e = sampleEmployee({ date: '15 Feb 2026' });
    expect(generateExitingBlurb([e])).toContain('Last working day');
    const m = generateExitingBlurb([e, sampleEmployee({ name: 'B' })]);
    expect(m).toContain('Exiting employees (2)');
  });
});
