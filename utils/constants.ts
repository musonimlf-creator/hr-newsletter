export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Legacy - kept for compatibility but not used with database
export const STORAGE_KEY = 'hr_newsletter_data';

export const SECTION_COLORS = {
  newHires: 'blue',
  promotions: 'green',
  transfers: 'purple',
  birthdays: 'pink',
  anniversaries: 'indigo',
  events: 'orange',
  bestEmployee: 'yellow',
  bestPerformer: 'amber',
  exitingEmployees: 'gray',
} as const;

// Simple shared passcode for HR/Admin to unlock edit mode.
// For production, move this to an environment variable.
// HR/Admin Passcode is now loaded from .env.local via API route
// This constant is no longer used - authentication happens server-side via /api/admin-auth
// Kept for backwards compatibility but should not be referenced in client code
