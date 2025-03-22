
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from '@/utils/taxCalculations';
import { TaxResults } from '@/types/tax';
import { FICA_RATES } from '@/constants/taxConstants';

interface FicaTaxTabProps {
  taxResults: TaxResults;
  grossSalary: number;
}

const FicaTaxTab: React.FC<FicaTaxTabProps> = ({ taxResults, grossSalary }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-4">FICA Tax Breakdown</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span>Social Security (6.2%)</span>
            <span className="font-medium">{formatCurrency(taxResults.fica.socialSecurity)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Medicare (1.45%)</span>
            <span className="font-medium">{formatCurrency(taxResults.fica.medicare)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total FICA Tax</span>
            <span>{formatCurrency(taxResults.fica.total)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground">FICA Taxable Income (Gross Salary)</p>
        <p className="text-xl font-bold">{formatCurrency(grossSalary)}</p>
      </div>
      
      <Alert>
        <AlertDescription>
          FICA taxes include Social Security tax (6.2% on first {formatCurrency(FICA_RATES.socialSecurityCap)} in 2024) and Medicare tax (1.45% on all income, plus 0.9% on income over {formatCurrency(FICA_RATES.medicareThreshold)}).
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FicaTaxTab;
