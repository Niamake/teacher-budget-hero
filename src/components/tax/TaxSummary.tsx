
import React from 'react';
import { TaxResults, TaxData } from '@/types/tax';
import { formatCurrency } from '@/utils/taxCalculations';

interface TaxSummaryProps {
  taxResults: TaxResults;
  taxData: TaxData;
}

const TaxSummary: React.FC<TaxSummaryProps> = ({ taxResults, taxData }) => {
  return (
    <div className="mt-8 p-5 bg-primary/10 rounded-lg border border-primary/20">
      <h3 className="text-lg font-medium mb-4">Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b">
          <span>Gross Annual Salary</span>
          <span className="font-medium">{formatCurrency(Number(taxData.grossSalary) || 0)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Retirement Contributions</span>
          <span className="font-medium">
            {formatCurrency(
              (Number(taxData.qppContribution) || 0) + 
              (Number(taxData.tdaContribution) || 0) + 
              (Number(taxData.deferredCompContribution) || 0)
            )}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Federal Tax</span>
          <span className="font-medium">{formatCurrency(taxResults.federal.tax)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>NY State Tax</span>
          <span className="font-medium">{formatCurrency(taxResults.state.tax)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>NYC Tax</span>
          <span className="font-medium">{formatCurrency(taxResults.city.tax)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>FICA Tax</span>
          <span className="font-medium">{formatCurrency(taxResults.fica.total)}</span>
        </div>
        <div className="flex justify-between py-2 text-xl font-bold">
          <span>Estimated Annual Take-Home Pay</span>
          <span>{formatCurrency(taxResults.takeHome.annual)}</span>
        </div>
        <div className="flex justify-between py-2 text-lg">
          <span>Estimated Monthly Take-Home Pay</span>
          <span className="font-medium">{formatCurrency(taxResults.takeHome.monthly)}</span>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        This is a simplified estimate and may not account for all tax credits, deductions, or other factors specific to your situation. Consult a tax professional for more detailed advice.
      </p>
    </div>
  );
};

export default TaxSummary;
