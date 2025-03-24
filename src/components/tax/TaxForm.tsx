import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock } from "lucide-react";
import { TaxData } from '@/types/tax';
import { STANDARD_DEDUCTIONS } from '@/constants/taxConstants';
import { formatCurrency, getCurrentPerSessionRate } from '@/utils/taxCalculations';

interface TaxFormProps {
  taxData: TaxData;
  setTaxData: React.Dispatch<React.SetStateAction<TaxData>>;
}

const TaxForm: React.FC<TaxFormProps> = ({ taxData, setTaxData }) => {
  const currentPerSessionRate = getCurrentPerSessionRate();
  const perSessionTotal = Number(taxData.perSessionHours || 0) * currentPerSessionRate;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <CardTitle>Income & Contributions</CardTitle>
        </div>
        <CardDescription>
          Adjust your annual income and retirement contributions to see how they affect your tax liability.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gross-salary">Annual Gross Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="gross-salary"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={taxData.grossSalary}
                onChange={(e) => setTaxData({ ...taxData, grossSalary: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Auto-filled from your budget page's estimated salary</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qpp-contribution">QPP Contribution</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="qpp-contribution"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={taxData.qppContribution}
                onChange={(e) => setTaxData({ ...taxData, qppContribution: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Based on your pension tier and salary</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tda-contribution">TDA Contribution</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="tda-contribution"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={taxData.tdaContribution}
                onChange={(e) => setTaxData({ ...taxData, tdaContribution: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deferred-comp">457(b) Deferred Comp Contribution</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="deferred-comp"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={taxData.deferredCompContribution}
                onChange={(e) => setTaxData({ ...taxData, deferredCompContribution: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Additional Income</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="extra-income">Other Annual Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="extra-income"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={taxData.extraIncome || ""}
                  onChange={(e) => setTaxData({ ...taxData, extraIncome: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">Any additional income not from your teaching position</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="per-session-hours">Per Session Hours</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </span>
                <Input
                  id="per-session-hours"
                  type="number"
                  placeholder="0"
                  className="pl-8"
                  value={taxData.perSessionHours || ""}
                  onChange={(e) => setTaxData({ ...taxData, perSessionHours: e.target.value })}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current rate: ${currentPerSessionRate.toFixed(2)}/hour</span>
                {perSessionTotal > 0 && (
                  <span>Total: {formatCurrency(perSessionTotal)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Alert variant="default" className="bg-muted/30">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Standard Deductions Applied</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li>Federal Standard Deduction: <span className="font-medium">{formatCurrency(STANDARD_DEDUCTIONS.federal)}</span></li>
              <li>NY State Standard Deduction: <span className="font-medium">{formatCurrency(STANDARD_DEDUCTIONS.state)}</span></li>
              <li>NYC Standard Deduction: <span className="font-medium">{formatCurrency(STANDARD_DEDUCTIONS.city)}</span></li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-muted-foreground">
          These values are automatically populated based on your profile and retirement settings. 
          You can adjust them to see how different contribution levels affect your taxes.
        </p>
      </CardContent>
    </Card>
  );
};

export default TaxForm;
