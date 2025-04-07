
import { PerSessionBudget, PerSessionEntry, PerSessionEarnings, TimeframeType } from '@/types/perSession';
import { format, parseISO, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { getCurrentPerSessionRate } from './taxCalculations';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get timeframe label
export const getTimeframeLabel = (timeframe: TimeframeType): string => {
  switch (timeframe) {
    case 'weekly':
      return 'per week';
    case 'monthly':
      return 'per month';
    case 'semester':
      return 'per semester';
    case 'yearly':
      return 'per year';
    default:
      return '';
  }
};

// Calculate remaining hours in budget
export const calculateRemainingHours = (
  budget: PerSessionBudget,
  entries: PerSessionEntry[]
): number => {
  const budgetEntries = entries.filter(entry => entry.budgetId === budget.id);
  const totalHoursUsed = budgetEntries.reduce((sum, entry) => sum + entry.hours, 0);
  return budget.hours - totalHoursUsed;
};

// Calculate earnings by month
export const calculateMonthlyEarnings = (
  entries: PerSessionEntry[],
  perSessionRate: number
): PerSessionEarnings[] => {
  const monthlyData: Record<string, number> = {};
  
  entries.forEach(entry => {
    const date = parseISO(entry.date);
    const monthKey = format(date, 'yyyy-MM');
    const monthName = format(date, 'MMM yyyy');
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    
    monthlyData[monthKey] += entry.hours * perSessionRate;
  });
  
  return Object.entries(monthlyData).map(([key, amount]) => ({
    month: format(parseISO(`${key}-01`), 'MMM yyyy'),
    amount
  })).sort((a, b) => a.month.localeCompare(b.month));
};

// Get entries for a specific month
export const getEntriesForMonth = (
  entries: PerSessionEntry[],
  month: Date
): PerSessionEntry[] => {
  return entries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return isSameMonth(entryDate, month);
  });
};

// Calculate total hours for a budget
export const calculateTotalHours = (
  budget: PerSessionBudget,
  entries: PerSessionEntry[]
): number => {
  return entries
    .filter(entry => entry.budgetId === budget.id)
    .reduce((sum, entry) => sum + entry.hours, 0);
};

// Calculate usage percentage
export const calculateUsagePercentage = (
  budget: PerSessionBudget,
  entries: PerSessionEntry[]
): number => {
  const totalHours = calculateTotalHours(budget, entries);
  return (totalHours / budget.hours) * 100;
};

// Format date for display
export const formatBudgetDate = (dateString?: string): string => {
  if (!dateString) return 'No end date set';
  return format(parseISO(dateString), 'PPP');
};
