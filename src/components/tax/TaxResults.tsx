
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { TaxResults as TaxResultsType, TaxData } from '@/types/tax';
import FederalTaxTab from './FederalTaxTab';
import StateTaxTab from './StateTaxTab';
import CityTaxTab from './CityTaxTab';
import FicaTaxTab from './FicaTaxTab';
import TaxSummary from './TaxSummary';

interface TaxResultsProps {
  taxResults: TaxResultsType;
  taxData: TaxData;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TaxResults: React.FC<TaxResultsProps> = ({ taxResults, taxData, activeTab, setActiveTab }) => {
  const grossSalary = Number(taxData.grossSalary) || 0;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle>Tax Estimates</CardTitle>
        </div>
        <CardDescription>
          Estimated tax breakdown based on your income and contributions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="federal">Federal</TabsTrigger>
            <TabsTrigger value="state">NY State</TabsTrigger>
            <TabsTrigger value="city">NYC</TabsTrigger>
            <TabsTrigger value="fica">FICA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="federal">
            <FederalTaxTab taxResults={taxResults} grossSalary={grossSalary} />
          </TabsContent>
          
          <TabsContent value="state">
            <StateTaxTab taxResults={taxResults} grossSalary={grossSalary} />
          </TabsContent>
          
          <TabsContent value="city">
            <CityTaxTab taxResults={taxResults} grossSalary={grossSalary} />
          </TabsContent>
          
          <TabsContent value="fica">
            <FicaTaxTab taxResults={taxResults} grossSalary={grossSalary} />
          </TabsContent>
        </Tabs>
        
        <TaxSummary taxResults={taxResults} taxData={taxData} />
      </CardContent>
    </Card>
  );
};

export default TaxResults;
