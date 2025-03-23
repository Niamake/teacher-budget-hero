
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Percent } from "lucide-react";
import { formatCurrency } from '@/utils/taxCalculations';
import { TaxResults } from '@/types/tax';
import { CITY_TAX_BRACKETS } from '@/constants/taxConstants';
import { CityTaxBracketTable } from './TaxBracketTable';

interface CityTaxTabProps {
  taxResults: TaxResults;
  grossSalary: number;
}

const CityTaxTab: React.FC<CityTaxTabProps> = ({ taxResults, grossSalary }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Percent className="h-4 w-4 mr-2" /> NYC Tax Brackets
        </h3>
        <CityTaxBracketTable brackets={CITY_TAX_BRACKETS} />
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-xl font-bold">{formatCurrency(taxResults.income.total)}</p>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">NYC Taxable Income</p>
            <p className="text-xl font-bold">
              {formatCurrency(taxResults.city.taxableIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Income - (TDA + 457b + $3,200 Standard Deduction)
            </p>
          </div>
        </div>
        
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg">Estimated NYC Tax</span>
              <span className="text-xl font-bold">{formatCurrency(taxResults.city.tax)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium">
                {taxResults.city.effectiveRate.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CityTaxTab;
