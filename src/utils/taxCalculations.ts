
import { TaxData, TaxResults } from "../types/tax";
import { 
  FEDERAL_TAX_BRACKETS, 
  STATE_TAX_BRACKETS, 
  CITY_TAX_BRACKETS,
  FICA_RATES, 
  STANDARD_DEDUCTIONS,
  PER_SESSION_RATES
} from "../constants/taxConstants";

// Get current per session rate
export const getCurrentPerSessionRate = (): number => {
  const today = new Date();
  let currentRate = 53.98; // Default to oldest rate
  
  // Find the most recent rate that applies
  for (const rateInfo of PER_SESSION_RATES) {
    if (today >= rateInfo.date) {
      currentRate = rateInfo.rate;
    } else {
      break;
    }
  }
  
  return currentRate;
};

export const calculateTaxes = (taxData: TaxData): TaxResults => {
  const grossSalary = Number(taxData.grossSalary) || 0;
  const qppContribution = Number(taxData.qppContribution) || 0;
  const tdaContribution = Number(taxData.tdaContribution) || 0;
  const deferredCompContribution = Number(taxData.deferredCompContribution) || 0;
  const extraIncome = Number(taxData.extraIncome) || 0;
  const perSessionHours = Number(taxData.perSessionHours) || 0;
  
  // Calculate per session income
  const perSessionRate = getCurrentPerSessionRate();
  const perSessionIncome = perSessionHours * perSessionRate;
  
  // Total gross income including salary, extra income, and per session
  const totalGrossIncome = grossSalary + extraIncome + perSessionIncome;
  
  // Calculate federal taxable income (subtract all retirement contributions and standard deduction)
  const federalTaxableIncome = Math.max(0, totalGrossIncome - qppContribution - tdaContribution - deferredCompContribution - STANDARD_DEDUCTIONS.federal);
  
  // Calculate state taxable income (subtract TDA and 457b but not QPP, and state standard deduction)
  const stateTaxableIncome = Math.max(0, totalGrossIncome - tdaContribution - deferredCompContribution - STANDARD_DEDUCTIONS.state);
  
  // City uses the same deductions as state but with city-specific standard deduction
  const cityTaxableIncome = Math.max(0, totalGrossIncome - tdaContribution - deferredCompContribution - STANDARD_DEDUCTIONS.city);
  
  // Calculate federal tax
  let federalTax = 0;
  
  // Apply tax brackets using progressive taxation
  for (let i = 0; i < FEDERAL_TAX_BRACKETS.length; i++) {
    const bracket = FEDERAL_TAX_BRACKETS[i];
    
    if (federalTaxableIncome > bracket.min) {
      const taxableInBracket = Math.min(
        federalTaxableIncome - bracket.min,
        bracket.max - bracket.min
      );
      federalTax += taxableInBracket * bracket.rate;
    }
    
    if (federalTaxableIncome <= bracket.max) {
      break;
    }
  }
  
  // Calculate state tax
  let stateTax = 0;
  
  // Find the appropriate bracket
  for (let i = STATE_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = STATE_TAX_BRACKETS[i];
    if (stateTaxableIncome > bracket.min) {
      stateTax = bracket.base + (stateTaxableIncome - bracket.over) * bracket.rate;
      break;
    }
  }
  
  // Calculate city tax
  let cityTax = 0;
  
  // Find the appropriate bracket
  for (let i = CITY_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = CITY_TAX_BRACKETS[i];
    if (cityTaxableIncome > bracket.min) {
      cityTax = bracket.base + (cityTaxableIncome - bracket.over) * bracket.rate;
      break;
    }
  }
  
  // Calculate FICA (Social Security & Medicare)
  // Social Security tax is 6.2% on first $160,200 (2024)
  const socialSecurityTax = Math.min(totalGrossIncome, FICA_RATES.socialSecurityCap) * FICA_RATES.socialSecurity;
  
  // Medicare tax is 1.45% on all income, plus 0.9% on income over $200,000
  let medicareTax = totalGrossIncome * FICA_RATES.medicare;
  if (totalGrossIncome > FICA_RATES.medicareThreshold) {
    medicareTax += (totalGrossIncome - FICA_RATES.medicareThreshold) * FICA_RATES.medicareAdditional;
  }
  
  const totalFicaTax = socialSecurityTax + medicareTax;
  
  // Calculate effective rates
  const federalEffectiveRate = federalTaxableIncome > 0 ? (federalTax / totalGrossIncome) * 100 : 0;
  const stateEffectiveRate = stateTaxableIncome > 0 ? (stateTax / totalGrossIncome) * 100 : 0;
  const cityEffectiveRate = cityTaxableIncome > 0 ? (cityTax / totalGrossIncome) * 100 : 0;
  
  // Calculate take-home pay
  const totalTax = federalTax + stateTax + cityTax + totalFicaTax;
  const totalDeductions = qppContribution + tdaContribution + deferredCompContribution;
  const annualTakeHomePay = totalGrossIncome - totalTax - totalDeductions;
  const monthlyTakeHomePay = annualTakeHomePay / 12;
  const biweeklyTakeHomePay = monthlyTakeHomePay / 2;
  
  return {
    federal: {
      taxableIncome: federalTaxableIncome,
      tax: federalTax,
      effectiveRate: federalEffectiveRate
    },
    state: {
      taxableIncome: stateTaxableIncome,
      tax: stateTax,
      effectiveRate: stateEffectiveRate
    },
    city: {
      taxableIncome: cityTaxableIncome,
      tax: cityTax,
      effectiveRate: cityEffectiveRate
    },
    fica: {
      socialSecurity: socialSecurityTax,
      medicare: medicareTax,
      total: totalFicaTax
    },
    takeHome: {
      annual: annualTakeHomePay,
      monthly: monthlyTakeHomePay,
      biweekly: biweeklyTakeHomePay
    },
    income: {
      salary: grossSalary,
      extraIncome: extraIncome,
      perSession: perSessionIncome,
      total: totalGrossIncome
    }
  };
};

// Format currency for display
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};
