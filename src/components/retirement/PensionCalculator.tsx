
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const earlyRetirementReductionTable = [
  { age: 62, reduction: 93.5 },
  { age: 61, reduction: 87.0 },
  { age: 60, reduction: 80.5 },
  { age: 59, reduction: 74.0 },
  { age: 58, reduction: 67.5 },
  { age: 57, reduction: 61.0 },
  { age: 56, reduction: 54.5 },
  { age: 55, reduction: 48.0 },
];

const PensionCalculator = () => {
  const [finalAverageSalary, setFinalAverageSalary] = useState<string>('');
  const [yearsOfService, setYearsOfService] = useState<string>('');
  const [retirementAge, setRetirementAge] = useState<string>('63');
  const [pensionEstimate, setPensionEstimate] = useState<number | null>(null);
  const [annualPension, setAnnualPension] = useState<number | null>(null);
  const [monthlyPension, setMonthlyPension] = useState<number | null>(null);
  
  const calculatePension = () => {
    const fas = parseFloat(finalAverageSalary) || 0;
    const years = parseInt(yearsOfService) || 0;
    const age = parseInt(retirementAge) || 63;
    
    // Calculate base pension percentage
    let pensionPercentage = 0;
    
    if (years <= 20) {
      // 1.66666667% per year for first 20 years
      pensionPercentage = years * 1.66666667;
    } else {
      // 35% for first 20 years plus 2% per year after that
      pensionPercentage = 35 + ((years - 20) * 2);
    }
    
    // Apply early retirement reduction if applicable
    if (age < 63) {
      const reductionEntry = earlyRetirementReductionTable.find(entry => entry.age === age);
      if (reductionEntry) {
        pensionPercentage = (pensionPercentage * reductionEntry.reduction) / 100;
      }
    }
    
    // Calculate annual pension amount
    const annual = (fas * pensionPercentage) / 100;
    const monthly = annual / 12;
    
    setPensionEstimate(pensionPercentage);
    setAnnualPension(annual);
    setMonthlyPension(monthly);
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
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Pension Benefit Calculator</CardTitle>
        </div>
        <CardDescription>
          Estimate your QPP pension benefit based on your years of service and final average salary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="final-average-salary">Final Average Salary (FAS)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="final-average-salary"
                type="number"
                placeholder="0"
                className="pl-8"
                value={finalAverageSalary}
                onChange={(e) => setFinalAverageSalary(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Average of your last 3 years' salary</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years-of-service">Years of Service</Label>
            <Input
              id="years-of-service"
              type="number"
              placeholder="0"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Total credited service years</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retirement-age">Retirement Age</Label>
            <Select value={retirementAge} onValueChange={setRetirementAge}>
              <SelectTrigger id="retirement-age">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="63">63 or older (No reduction)</SelectItem>
                <SelectItem value="62">62</SelectItem>
                <SelectItem value="61">61</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="59">59</SelectItem>
                <SelectItem value="58">58</SelectItem>
                <SelectItem value="57">57</SelectItem>
                <SelectItem value="56">56</SelectItem>
                <SelectItem value="55">55</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Age at retirement (affects benefit reduction)</p>
          </div>
        </div>
        
        <Button onClick={calculatePension} className="w-full">Calculate Pension Benefit</Button>
        
        {pensionEstimate !== null && (
          <div className="space-y-6 mt-6">
            <div className="p-6 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Estimated Pension Benefit</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pension Percentage</p>
                  <p className="text-2xl font-bold">{pensionEstimate.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Of your final average salary</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Annual Pension</p>
                  <p className="text-2xl font-bold">{formatCurrency(annualPension!)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Before taxes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Benefit</p>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyPension!)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Before taxes</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Early Retirement Reduction Table</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age at Retirement</TableHead>
                    <TableHead>% of Benefit After Reduction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>63 or older</TableCell>
                    <TableCell>100.0%</TableCell>
                  </TableRow>
                  {earlyRetirementReductionTable.map((entry) => (
                    <TableRow key={entry.age}>
                      <TableCell>{entry.age}</TableCell>
                      <TableCell>{entry.reduction}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PensionCalculator;
