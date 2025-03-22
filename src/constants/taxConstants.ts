
import { FederalTaxBracket, StateTaxBracket, CityTaxBracket, FicaRates, StandardDeductions } from "../types/tax";

// Federal tax brackets for 2024
export const FEDERAL_TAX_BRACKETS: FederalTaxBracket[] = [
  { rate: 0.10, min: 0, max: 11600 },
  { rate: 0.12, min: 11601, max: 47150 },
  { rate: 0.22, min: 47151, max: 100525 },
  { rate: 0.24, min: 100526, max: 191950 },
  { rate: 0.32, min: 191951, max: 243725 },
  { rate: 0.35, min: 243726, max: 609350 },
  { rate: 0.37, min: 609351, max: Number.MAX_SAFE_INTEGER }
];

// NY State tax brackets for 2024
export const STATE_TAX_BRACKETS: StateTaxBracket[] = [
  { rate: 0.04, min: 0, max: 8500, base: 0, over: 0 },
  { rate: 0.045, min: 8501, max: 11700, base: 340, over: 8500 },
  { rate: 0.0525, min: 11701, max: 13900, base: 484, over: 11700 },
  { rate: 0.055, min: 13901, max: 80650, base: 600, over: 13900 },
  { rate: 0.06, min: 80651, max: 215400, base: 4271, over: 80650 },
  { rate: 0.0685, min: 215401, max: 1077550, base: 12356, over: 215400 }
];

// NYC tax brackets for 2024
export const CITY_TAX_BRACKETS: CityTaxBracket[] = [
  { rate: 0.03078, min: 0, max: 12000, base: 0, over: 0 },
  { rate: 0.03762, min: 12001, max: 25000, base: 369, over: 12000 },
  { rate: 0.03819, min: 25001, max: 50000, base: 858, over: 25000 },
  { rate: 0.03876, min: 50001, max: Number.MAX_SAFE_INTEGER, base: 1813, over: 50000 }
];

// FICA rates for 2024
export const FICA_RATES: FicaRates = {
  socialSecurity: 0.062, // 6.2%
  medicare: 0.0145, // 1.45%
  medicareAdditional: 0.009, // 0.9% additional for high earners
  medicareThreshold: 200000, // $200,000 threshold for additional Medicare tax
  socialSecurityCap: 160200 // Social Security tax cap for 2024
};

// Standard deductions
export const STANDARD_DEDUCTIONS: StandardDeductions = {
  federal: 14600, // Federal standard deduction for single filers
  state: 8000 // NY State standard deduction for single filers
};
