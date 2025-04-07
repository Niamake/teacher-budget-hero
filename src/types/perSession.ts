

export type TimeframeType = 'weekly' | 'monthly' | 'semester' | 'yearly';

export interface PerSessionBudget {
  id: string;
  name: string;
  hours: number;
  timeframe: TimeframeType;
  notes?: string;
  createdAt: string;
  endDate: string; // No longer optional
}

export interface PerSessionEntry {
  id: string;
  budgetId: string;
  date: string;
  hours: number;
  description: string;
  createdAt: string;
}

export interface PerSessionEarnings {
  month: string;
  amount: number;
}
