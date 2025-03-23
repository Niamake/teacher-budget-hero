
// Tax data input
export interface TaxData {
  grossSalary: string;
  qppContribution: string;
  tdaContribution: string;
  deferredCompContribution: string;
  extraIncome?: string;
  perSessionHours?: string;
}

// Tax calculation results
export interface TaxResults {
  federal: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  state: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  city: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  fica: {
    socialSecurity: number;
    medicare: number;
    total: number;
  };
  takeHome: {
    annual: number;
    monthly: number;
    biweekly: number;
  };
  income: {
    salary: number;
    extraIncome: number;
    perSession: number;
    total: number;
  };
}

// Tax bracket types
export interface FederalTaxBracket {
  rate: number;
  min: number;
  max: number;
}

export interface StateTaxBracket {
  rate: number;
  min: number;
  max: number;
  base: number;
  over: number;
}

export type CityTaxBracket = StateTaxBracket;

export interface FicaRates {
  socialSecurity: number;
  medicare: number;
  medicareAdditional: number;
  medicareThreshold: number;
  socialSecurityCap: number;
}

export interface StandardDeductions {
  federal: number;
  state: number;
  city: number;
}
