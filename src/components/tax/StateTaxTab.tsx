
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Percent } from "lucide-react";
import { formatCurrency } from '@/utils/taxCalculations';
import { TaxResults } from '@/types/tax';
import { STATE_TAX_BRACKETS } from '@/constants/taxConstants';
import { StateTaxBracketTable } from './TaxBracketTable';

interface StateTaxTabProps {
  taxResults: TaxResults;
  grossSalary: number;
}

const StateTaxTab: React.FC<StateTaxTabProps> = ({ taxResults, grossSalary }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Percent className="h-4 w-4 mr-2" /> NY State Tax Brackets
        </h3>
        <StateTaxBracketTable brackets={STATE_TAX_BRACKETS} />
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Gross Salary</p>
            <p className="text-xl font-bold">{formatCurrency(grossSalary)}</p>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">NY State Taxable Income</p>
            <p className="text-xl font-bold">
              {formatCurrency(taxResults.state.taxableIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Gross - (TDA + 457b + Standard Deduction)
            </p>
          </div>
        </div>
        
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg">Estimated NY State Tax</span>
              <span className="text-xl font-bold">{formatCurrency(taxResults.state.tax)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium">
                {taxResults.state.effectiveRate.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StateTaxTab;
