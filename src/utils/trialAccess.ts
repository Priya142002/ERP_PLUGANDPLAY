// Trial access utility — 30-day free demo logic

export const TRIAL_DAYS = 30;

export const ALL_MODULE_IDS = [
  'inventory', 'purchase', 'sales', 'accounts',
  'crm', 'hrm', 'projects', 'helpdesk',
  'assets', 'logistics', 'production', 'billing'
];

export interface TrialStatus {
  isTrial: boolean;           // true = on free trial (no active subscription)
  isExpired: boolean;         // true = trial > 30 days
  daysUsed: number;
  daysRemaining: number;
  trialStartDate: Date | null;
}

export function getTrialStatus(trialStartDate: Date | null | undefined): TrialStatus {
  if (!trialStartDate) {
    return { isTrial: false, isExpired: false, daysUsed: 0, daysRemaining: TRIAL_DAYS, trialStartDate: null };
  }

  const start = new Date(trialStartDate);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUsed = Math.floor((now.getTime() - start.getTime()) / msPerDay);
  const daysRemaining = Math.max(0, TRIAL_DAYS - daysUsed);
  const isExpired = daysUsed >= TRIAL_DAYS;

  return {
    isTrial: true,
    isExpired,
    daysUsed,
    daysRemaining,
    trialStartDate: start
  };
}

// Get trial start date from localStorage (keyed by email)
export function getStoredTrialStart(email: string): Date | null {
  try {
    const key = `trial_start_${email}`;
    const stored = localStorage.getItem(key);
    if (stored) return new Date(stored);
  } catch {}
  return null;
}

// Store trial start date (only sets once — first login)
export function initTrialStart(email: string): Date {
  const key = `trial_start_${email}`;
  const existing = localStorage.getItem(key);
  if (existing) return new Date(existing);
  const now = new Date();
  localStorage.setItem(key, now.toISOString());
  return now;
}
