
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Calculator, DollarSign, FileText, Percent } from "lucide-react";
import { toast } from "sonner";

// Define types for our tax data
interface TaxData {
  grossSalary: string;
  qppContribution: string;
  tdaContribution: string;
  deferredCompContribution: string;
}

// Federal tax brackets for 2024
const FEDERAL_TAX_BRACKETS = [
  { rate: 0.10, min: 0, max: 11600 },
  { rate: 0.12, min: 11601, max: 47150 },
  { rate: 0.22, min: 47151, max: 100525 },
  { rate: 0.24, min: 100526, max: 191950 },
  { rate: 0.32, min: 191951, max: 243725 },
  { rate: 0.35, min: 243726, max: 609350 },
  { rate: 0.37, min: 609351, max: Number.MAX_SAFE_INTEGER }
];

// FICA rates for 2024
const FICA_RATES = {
  socialSecurity: 0.062, // 6.2%
  medicare: 0.0145, // 1.45%
  medicareAdditional: 0.009, // 0.9% additional for high earners
  medicareThreshold: 200000 // $200,000 threshold for additional Medicare tax
};

const TaxEstimate = () => {
  const [taxData, setTaxData] = useState<TaxData>({
    grossSalary: "",
    qppContribution: "",
    tdaContribution: "",
    deferredCompContribution: ""
  });
  
  const [activeTab, setActiveTab] = useState("federal");
  const [federalTax, setFederalTax] = useState<number>(0);
  const [ficaTax, setFicaTax] = useState<{ socialSecurity: number, medicare: number, total: number }>({
    socialSecurity: 0,
    medicare: 0,
    total: 0
  });
  const [takeHomePay, setTakeHomePay] = useState<number>(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load salary data from localStorage if available
    const teacherProfile = localStorage.getItem('teacherProfile');
    const retirementData = localStorage.getItem('retirementData');
    
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        if (profileData.salary) {
          setTaxData(prev => ({ ...prev, grossSalary: profileData.salary.toString() }));
        }
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }
    
    if (retirementData) {
      try {
        const parsedData = JSON.parse(retirementData);
        setTaxData(prev => ({
          ...prev,
          qppContribution: "4300", // Default QPP contribution (could be adjusted)
          tdaContribution: parsedData.tdaData?.annualContribution || "",
          deferredCompContribution: parsedData.deferredCompData?.annualContribution || ""
        }));
      } catch (error) {
        console.error("Failed to parse retirement data:", error);
      }
    }
  }, []);
  
  const calculateTaxes = () => {
    const grossSalary = Number(taxData.grossSalary) || 0;
    const qppContribution = Number(taxData.qppContribution) || 0;
    const tdaContribution = Number(taxData.tdaContribution) || 0;
    const deferredCompContribution = Number(taxData.deferredCompContribution) || 0;
    
    // Calculate federal taxable income
    const federalTaxableIncome = grossSalary - qppContribution - tdaContribution - deferredCompContribution;
    
    // Calculate federal tax
    let federalTaxAmount = 0;
    let remainingIncome = federalTaxableIncome;
    
    for (const bracket of FEDERAL_TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min + 1);
      federalTaxAmount += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    
    // Calculate FICA (Social Security & Medicare)
    // Social Security tax is 6.2% on first $160,200 (2024)
    const socialSecurityTax = Math.min(grossSalary, 160200) * FICA_RATES.socialSecurity;
    
    // Medicare tax is 1.45% on all income, plus 0.9% on income over $200,000
    let medicareTax = grossSalary * FICA_RATES.medicare;
    if (grossSalary > FICA_RATES.medicareThreshold) {
      medicareTax += (grossSalary - FICA_RATES.medicareThreshold) * FICA_RATES.medicareAdditional;
    }
    
    const totalFicaTax = socialSecurityTax + medicareTax;
    
    // Set tax results
    setFederalTax(federalTaxAmount);
    setFicaTax({
      socialSecurity: socialSecurityTax,
      medicare: medicareTax,
      total: totalFicaTax
    });
    
    // Calculate take-home pay
    // This is a simplified calculation and does not include state/local taxes or other deductions
    const estimatedTakeHomePay = grossSalary - federalTaxAmount - totalFicaTax - qppContribution - tdaContribution - deferredCompContribution;
    setTakeHomePay(estimatedTakeHomePay);
    
    toast.success("Tax estimates calculated successfully");
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Tax Estimation</h1>
          <p className="text-lg text-foreground/80 mb-8">
            Get a clearer picture of your tax obligations with calculators designed for NYC teachers.
          </p>
          
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              We are not tax specialists. The estimates provided are for informational purposes only. 
              For tax advice specific to your situation, please consult with a qualified accountant 
              or tax specialist.
            </AlertDescription>
          </Alert>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <CardTitle>Income & Contributions</CardTitle>
              </div>
              <CardDescription>
                Enter your annual income and retirement contributions to estimate your tax liability.
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
                  <p className="text-xs text-muted-foreground">Typically around $4,300 for NYC teachers</p>
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
              
              <Button 
                className="w-full" 
                onClick={calculateTaxes}
                disabled={!taxData.grossSalary}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Tax Estimates
              </Button>
            </CardContent>
          </Card>
          
          {federalTax > 0 && (
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
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="federal">Federal Taxes</TabsTrigger>
                    <TabsTrigger value="fica">FICA Taxes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="federal" className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Percent className="h-4 w-4 mr-2" /> Federal Tax Brackets
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tax Rate</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {FEDERAL_TAX_BRACKETS.map((bracket, index) => (
                            <TableRow key={index}>
                              <TableCell>{(bracket.rate * 100).toFixed(0)}%</TableCell>
                              <TableCell>{formatCurrency(bracket.min)}</TableCell>
                              <TableCell>
                                {bracket.max === Number.MAX_SAFE_INTEGER 
                                  ? "and up" 
                                  : formatCurrency(bracket.max)
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">Gross Salary</p>
                          <p className="text-xl font-bold">{formatCurrency(Number(taxData.grossSalary) || 0)}</p>
                        </div>
                        
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">Federal Taxable Income</p>
                          <p className="text-xl font-bold">
                            {formatCurrency(
                              (Number(taxData.grossSalary) || 0) - 
                              (Number(taxData.qppContribution) || 0) - 
                              (Number(taxData.tdaContribution) || 0) - 
                              (Number(taxData.deferredCompContribution) || 0)
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <Card className="border-primary">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <span className="text-lg">Estimated Federal Tax</span>
                            <span className="text-xl font-bold">{formatCurrency(federalTax)}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
                            <span className="font-medium">
                              {(federalTax / (Number(taxData.grossSalary) || 1) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fica" className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">FICA Tax Breakdown</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                          <span>Social Security (6.2%)</span>
                          <span className="font-medium">{formatCurrency(ficaTax.socialSecurity)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>Medicare (1.45%)</span>
                          <span className="font-medium">{formatCurrency(ficaTax.medicare)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold">
                          <span>Total FICA Tax</span>
                          <span>{formatCurrency(ficaTax.total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground">FICA Taxable Income (Gross Salary)</p>
                      <p className="text-xl font-bold">{formatCurrency(Number(taxData.grossSalary) || 0)}</p>
                    </div>
                    
                    <Alert>
                      <AlertDescription>
                        FICA taxes include Social Security tax (6.2% on first $160,200 in 2024) and Medicare tax (1.45% on all income, plus 0.9% on income over $200,000).
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
                
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
                      <span className="font-medium">{formatCurrency(federalTax)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>FICA Tax</span>
                      <span className="font-medium">{formatCurrency(ficaTax.total)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-xl font-bold">
                      <span>Estimated Annual Take-Home Pay</span>
                      <span>{formatCurrency(takeHomePay)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg">
                      <span>Estimated Monthly Take-Home Pay</span>
                      <span className="font-medium">{formatCurrency(takeHomePay / 12)}</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    This is a simplified estimate and does not include state and local taxes, which can significantly impact your take-home pay. Consult a tax professional for more detailed advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaxEstimate;
