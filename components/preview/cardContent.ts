import type { Employee } from '@/types/newsletter';

// Generate concise, human-friendly copy for New Hires
export function generateNewHiresBlurb(employees: Employee[]) {
  if (!employees || employees.length === 0) return '';
  if (employees.length === 1) {
    const e = employees[0];
    const position = e.position ? `${e.position}` : 'role not provided';
    const dept = e.department ? `${e.department}` : 'department not provided';
    // Prefer a clear sentence that explicitly states position and department
    return `Please join us in welcoming ${e.name}, who joins us as ${position} in the ${dept}.`;
  }

  // Multiple hires: include position + department inline in the top summary for clarity
  const inline = employees.map(e => {
    const position = e.position ? `${e.position}` : 'role not provided';
    const dept = e.department ? `${e.department}` : 'department not provided';
    return `${e.name} — ${position} in ${dept}`;
  }).join('; ');

  return `Welcome ${employees.length} new team members: ${inline}. See details below.`;
}

// Generate concise, celebratory copy for Promotions
export function generatePromotionsBlurb(employees: Employee[]) {
  if (!employees || employees.length === 0) return '';
  if (employees.length === 1) {
    const e = employees[0];
    const newRole = e.position ? `${e.position}` : 'role not provided';
    const newDept = e.department ? `${e.department}` : 'department not provided';

    // If we have previous position/department info, use explicit prior → now phrasing
    if (e.previousPosition || e.previousDepartment) {
      const prevPos = e.previousPosition ?? 'role not provided';
      const prevDept = e.previousDepartment ?? (e.department ?? 'department not provided');
      return `${e.name} was ${prevPos}${e.previousDepartment ? ` in ${prevDept}` : ''} and is now ${newRole}${e.department ? ` in ${newDept}` : ''}.`;
    }

    return `${e.name} has been promoted to ${newRole} in the ${newDept}. Please join us in congratulating them.`;
  }

  const names = employees.map(e => e.name).join(', ');
  const bullets = employees.map(e => {
    const newRole = e.position ? `${e.position}` : 'role not provided';
    const dept = e.department ? ` — ${e.department}` : ' — department not provided';
    return `${e.name} — ${newRole}${dept}`;
  });

  return `Congratulations to ${employees.length} colleagues on their promotions: ${names}.` + '\n\n' + bullets.join('\n');
}

// Transfers: show from → to and effective date when available
export function generateTransfersBlurb(employees: Employee[]) {
  if (!employees || employees.length === 0) return '';
  if (employees.length === 1) {
    const e = employees[0];
    const date = e.date ? `, effective ${e.date}` : '';

    // If we have explicit from/to positions (not just departments), prefer prior → now phrasing
    if (e.fromPosition || e.toPosition) {
      const fromPos = e.fromPosition ?? 'role not provided';
      const fromDept = e.fromDepartment ?? 'department not provided';
      const toPos = e.toPosition ?? 'role not provided';
      const toDept = e.toDepartment ?? 'department not provided';
      return `${e.name} was ${fromPos}${e.fromDepartment ? ` in ${fromDept}` : ''} and is now ${toPos}${e.toDepartment ? ` in ${toDept}` : ''}${date}.`;
    }

    const from = e.fromDepartment ? `${e.fromDepartment}` : 'previous department not provided';
    const to = e.toDepartment ? `${e.toDepartment}` : 'new department not provided';

    return `${e.name} is transferring from ${from} to ${to}${date}. Please join us in wishing them a smooth transition.`;
  }

  const bullets = employees.map(e => {
    const from = e.fromDepartment ? `${e.fromDepartment}` : 'previous department not provided';
    const to = e.toDepartment ? `${e.toDepartment}` : 'new department not provided';
    const date = e.date ? ` • ${e.date}` : '';
    return `${e.name} — ${from} → ${to}${date}`;
  });

  return `Employee transfers (${employees.length}):` + '\n\n' + bullets.join('\n');
}

// Anniversaries: emphasize years of service if available, otherwise neutral phrasing
export function generateAnniversariesBlurb(employees: Employee[]) {
  if (!employees || employees.length === 0) return '';
  if (employees.length === 1) {
    const e = employees[0];
    // look for a 'blurb' or 'date' to extract years, else be neutral
    const yearsMatch = e.blurb?.match(/(\d+)\s*years?/i);
    const years = yearsMatch ? `${yearsMatch[1]} years` : null;
    const dept = e.department ? `${e.department}` : 'department not provided';
    if (years) return `Celebrating ${e.name} — ${years} of service in the ${dept}. Thank you for your dedication.`;
    return `Celebrating ${e.name}'s work anniversary${e.department ? ` in the ${dept}` : ''}. Thank you for your continued dedication.`;
  }

  const bullets = employees.map(e => {
    const yearsMatch = e.blurb?.match(/(\d+)\s*years?/i);
    const years = yearsMatch ? ` — ${yearsMatch[1]} years` : '';
    const dept = e.department ? ` — ${e.department}` : '';
    return `${e.name}${years}${dept}`;
  });

  return `Work anniversaries (${employees.length}):` + '\n\n' + bullets.join('\n');
}

// Events: concise listing with date, location, and short description
export function generateEventsBlurb(events: { title: string; date: string; location?: string; description?: string }[]) {
  if (!events || events.length === 0) return '';
  if (events.length === 1) {
    const ev = events[0];
    const loc = ev.location ? ` — ${ev.location}` : '';
    const desc = ev.description ? `: ${ev.description}` : '';
    return `${ev.title} on ${ev.date}${loc}${desc}`;
  }

  const bullets = events.map(ev => {
    const loc = ev.location ? ` — ${ev.location}` : '';
    const desc = ev.description ? `: ${ev.description}` : '';
    return `${ev.title} — ${ev.date}${loc}${desc}`;
  });

  return `Upcoming events (${events.length}):` + '\n\n' + bullets.join('\n');
}

// Recognition: best employee / best performer — include achievement if provided
export function generateRecognitionBlurb(emp: Employee | null, typeLabel = 'Recognition') {
  if (!emp) return '';
  const position = emp.position ? `${emp.position}` : 'role not provided';
  const dept = emp.department ? `${emp.department}` : 'department not provided';
  const ach = emp.achievement ? ` — ${emp.achievement}` : '';
  return `${emp.name} — ${position} in ${dept}${ach}`;
}

// Exiting employees: respectful, factual summary including last working day if present
export function generateExitingBlurb(employees: Employee[]) {
  if (!employees || employees.length === 0) return '';
  if (employees.length === 1) {
    const e = employees[0];
    const position = e.position ? `${e.position}` : 'role not provided';
    const dept = e.department ? `${e.department}` : 'department not provided';
    const last = e.date ? ` Last working day: ${e.date}.` : '';
    return `${e.name} — ${position} in ${dept}.${last} We thank them for their contributions and wish them well.`;
  }

  const bullets = employees.map(e => `${e.name} — ${e.position ? e.position : 'role not provided'} in ${e.department ? e.department : 'department not provided'}${e.date ? ` • ${e.date}` : ''}`);
  return `Exiting employees (${employees.length}):` + '\n\n' + bullets.join('\n');
}
