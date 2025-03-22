import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Calculator, DollarSign, FileText, Percent, InfoIcon } from "lucide-react";
import { toast } from "sonner";

// Define types for our tax data
interface TaxData {
  grossSalary: string;
  qppContribution: string;
  tdaContribution: string;
  deferredCompContribution: string;
}

// Tax calculation results
interface TaxResults {
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
  };
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

// NY State tax brackets for 2024
const STATE_TAX_BRACKETS = [
  { rate: 0.04, min: 0, max: 8500, base: 0, over: 0 },
  { rate: 0.045, min: 8501, max: 11700, base: 340, over: 8500 },
  { rate: 0.0525, min: 11701, max: 13900, base: 484, over: 11700 },
  { rate: 0.055, min: 13901, max: 80650, base: 600, over: 13900 },
  { rate: 0.06, min: 80651, max: 215400, base: 4271, over: 80650 },
  { rate: 0.0685, min: 215401, max: 1077550, base: 12356, over: 215400 }
];

// NYC tax brackets for 2024
const CITY_TAX_BRACKETS = [
  { rate: 0.03078, min: 0, max: 12000, base: 0, over: 0 },
  { rate: 0.03762, min: 12001, max: 25000, base: 369, over: 12000 },
  { rate: 0.03819, min: 25001, max: 50000, base: 858, over: 25000 },
  { rate: 0.03876, min: 50001, max: Number.MAX_SAFE_INTEGER, base: 1813, over: 50000 }
];

// FICA rates for 2024
const FICA_RATES = {
  socialSecurity: 0.062, // 6.2%
  medicare: 0.0145, // 1.45%
  medicareAdditional: 0.009, // 0.9% additional for high earners
  medicareThreshold: 200000, // $200,000 threshold for additional Medicare tax
  socialSecurityCap: 160200 // Social Security tax cap for 2024
};

// Standard deductions
const STANDARD_DEDUCTIONS = {
  federal: 14600, // Federal standard deduction for single filers
  state: 8000 // NY State standard deduction for single filers
};

const TaxEstimate = () => {
  const [taxData, setTaxData] = useState<TaxData>({
    grossSalary: "",
    qppContribution: "",
    tdaContribution: "",
    deferredCompContribution: ""
  });
  
  const [activeTab, setActiveTab] = useState("federal");
  const [taxResults, setTaxResults] = useState<TaxResults>({
    federal: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    state: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    city: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    fica: { socialSecurity: 0, medicare: 0, total: 0 },
    takeHome: { annual: 0, monthly: 0 }
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load salary data from localStorage if available
    const teacherProfile = localStorage.getItem('teacherProfile');
    const retirementData = localStorage.getItem('retirementData');
    const qppData = localStorage.getItem('qppData');
    
    let grossSalary = "";
    let qppContribution = "";
    let tdaContribution = "";
    let deferredCompContribution = "";
    
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        // First try to get the estimated salary from budget page
        if (profileData.estimatedSalary) {
          grossSalary = profileData.estimatedSalary.toString();
        } else if (profileData.salary) {
          // Fall back to the salary from job info
          grossSalary = profileData.salary.toString();
        }
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }
    
    if (qppData && grossSalary) {
      try {
        const parsedQppData = JSON.parse(qppData);
        const contributionRate = parsedQppData.contributionRate || 0;
        qppContribution = (Number(grossSalary) * (contributionRate / 100)).toString();
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }
    
    if (retirementData) {
      try {
        const parsedData = JSON.parse(retirementData);
        tdaContribution = parsedData.tdaData?.annualContribution || "";
        deferredCompContribution = parsedData.deferredCompData?.annualContribution || "";
      } catch (error) {
        console.error("Failed to parse retirement data:", error);
      }
    }
    
    setTaxData({
      grossSalary,
      qppContribution,
      tdaContribution,
      deferredCompContribution
    });
  }, []);
  
  // Automatically calculate taxes whenever tax data changes
  useEffect(() => {
    if (taxData.grossSalary) {
      calculateTaxes();
    }
  }, [taxData]);
  
  const calculateTaxes = () => {
    const grossSalary = Number(taxData.grossSalary) || 0;
    const qppContribution = Number(taxData.qppContribution) || 0;
    const tdaContribution = Number(taxData.tdaContribution) || 0;
    const deferredCompContribution = Number(taxData.deferredCompContribution) || 0;
    
    // Calculate federal taxable income (subtract all retirement contributions and standard deduction)
    const federalTaxableIncome = Math.max(0, grossSalary - qppContribution - tdaContribution - deferredCompContribution - STANDARD_DEDUCTIONS.federal);
    
    // Calculate state and city taxable income (subtract TDA and 457b but not QPP, and state standard deduction)
    const stateTaxableIncome = Math.max(0, grossSalary - tdaContribution - deferredCompContribution - STANDARD_DEDUCTIONS.state);
    
    // City uses the same taxable income as state
    const cityTaxableIncome = stateTaxableIncome;
    
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
    const socialSecurityTax = Math.min(grossSalary, FICA_RATES.socialSecurityCap) * FICA_RATES.socialSecurity;
    
    // Medicare tax is 1.45% on all income, plus 0.9% on income over $200,000
    let medicareTax = grossSalary * FICA_RATES.medicare;
    if (grossSalary > FICA_RATES.medicareThreshold) {
      medicareTax += (grossSalary - FICA_RATES.medicareThreshold) * FICA_RATES.medicareAdditional;
    }
    
    const totalFicaTax = socialSecurityTax + medicareTax;
    
    // Calculate effective rates
    const federalEffectiveRate = federalTaxableIncome > 0 ? (federalTax / grossSalary) * 100 : 0;
    const stateEffectiveRate = stateTaxableIncome > 0 ? (stateTax / grossSalary) * 100 : 0;
    const cityEffectiveRate = cityTaxableIncome > 0 ? (cityTax / grossSalary) * 100 : 0;
    
    // Calculate take-home pay
    const totalTax = federalTax + stateTax + cityTax + totalFicaTax;
    const totalDeductions = qppContribution + tdaContribution + deferredCompContribution;
    const annualTakeHomePay = grossSalary - totalTax - totalDeductions;
    const monthlyTakeHomePay = annualTakeHomePay / 12;
    
    // Set tax results
    setTaxResults({
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
        monthly: monthlyTakeHomePay
      }
    });
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
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Tax Estimation</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Get a clearer picture of your tax obligations with calculators designed for NYC teachers.
          </p>
          
          <Alert variant="default" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              <p className="mb-2">We are not tax specialists. The estimates provided are for informational purposes only. 
              For tax advice specific to your situation, please consult with a qualified accountant 
              or tax specialist.</p>
              <p>These calculations assume you are <strong>filing as single with no dependents</strong>, taking the standard deduction.</p>
            </AlertDescription>
          </Alert>
          
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
          
          {taxResults.federal.tax > 0 && (
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
                            {formatCurrency(taxResults.federal.taxableIncome)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Gross - (QPP + TDA + 457b + Standard Deduction)
                          </p>
                        </div>
                      </div>
                      
                      <Card className="border-primary">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <span className="text-lg">Estimated Federal Tax</span>
                            <span className="text-xl font-bold">{formatCurrency(taxResults.federal.tax)}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
                            <span className="font-medium">
                              {taxResults.federal.effectiveRate.toFixed(1)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="state" className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Percent className="h-4 w-4 mr-2" /> NY State Tax Brackets
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tax Rate</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Tax Calculation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {STATE_TAX_BRACKETS.map((bracket, index) => (
                            <TableRow key={index}>
                              <TableCell>{(bracket.rate * 100).toFixed(2)}%</TableCell>
                              <TableCell>{formatCurrency(bracket.min)}</TableCell>
                              <TableCell>
                                {bracket.max === Number.MAX_SAFE_INTEGER 
                                  ? "and up" 
                                  : formatCurrency(bracket.max)
                                }
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatCurrency(bracket.base)} + {(bracket.rate * 100).toFixed(2)}% over {formatCurrency(bracket.over)}
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
                  </TabsContent>
                  
                  <TabsContent value="city" className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Percent className="h-4 w-4 mr-2" /> NYC Tax Brackets
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tax Rate</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Tax Calculation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {CITY_TAX_BRACKETS.map((bracket, index) => (
                            <TableRow key={index}>
                              <TableCell>{(bracket.rate * 100).toFixed(3)}%</TableCell>
                              <TableCell>{formatCurrency(bracket.min)}</TableCell>
                              <TableCell>
                                {bracket.max === Number.MAX_SAFE_INTEGER 
                                  ? "and up" 
                                  : formatCurrency(bracket.max)
                                }
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatCurrency(bracket.base)} + {(bracket.rate * 100).toFixed(3)}% over {formatCurrency(bracket.over)}
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
                          <p className="text-sm text-muted-foreground">NYC Taxable Income</p>
                          <p className="text-xl font-bold">
                            {formatCurrency(taxResults.city.taxableIncome)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Same as NY State taxable income
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
                  </TabsContent>
                  
                  <TabsContent value="fica" className="space-y-6">
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
                      <p className="text-xl font-bold">{formatCurrency(Number(taxData.grossSalary) || 0)}</p>
                    </div>
                    
                    <Alert>
                      <AlertDescription>
                        FICA taxes include Social Security tax (6.2% on first {formatCurrency(FICA_RATES.socialSecurityCap)} in 2024) and Medicare tax (1.45% on all income, plus 0.9% on income over {formatCurrency(FICA_RATES.medicareThreshold)}).
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
