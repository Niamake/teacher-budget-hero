
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { TaxData } from '@/types/tax';
import { STANDARD_DEDUCTIONS } from '@/constants/taxConstants';
import { formatCurrency } from '@/utils/taxCalculations';

interface TaxFormProps {
  taxData: TaxData;
  setTaxData: React.Dispatch<React.SetStateAction<TaxData>>;
}

const TaxForm: React.FC<TaxFormProps> = ({ taxData, setTaxData }) => {
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
        
        <Alert variant="default" className="bg-muted/30">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Standard Deductions Applied</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li>Federal Standard Deduction: <span className="font-medium">{formatCurrency(STANDARD_DEDUCTIONS.federal)}</span></li>
              <li>NY State Standard Deduction: <span className="font-medium">{formatCurrency(STANDARD_DEDUCTIONS.state)}</span></li>
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
