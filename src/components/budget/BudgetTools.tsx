
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, Calculator, CreditCard } from 'lucide-react';
import { formatCurrency, getCurrentPerSessionRate } from '@/utils/taxCalculations';

const BudgetTools = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState<any>({
    takeHomeAnnual: 0,
    takeHomeMonthly: 0,
    takeHomeBiweekly: 0,
    extraIncome: "",
    perSessionHours: ""
  });
  const [paycheck, setPaycheck] = useState<string>("");
  
  useEffect(() => {
    // Load budget data from localStorage
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const parsedData = JSON.parse(storedBudgetData);
        setBudgetData(parsedData);
        
        // Set initial paycheck amount from the biweekly take-home pay
        if (parsedData.takeHomeBiweekly) {
          setPaycheck(Math.round(parsedData.takeHomeBiweekly).toString());
        }
      } catch (error) {
        console.error("Failed to parse budget data:", error);
      }
    }
  }, []);
  
  const handleExtraIncomeChange = (value: string) => {
    const updatedData = { ...budgetData, extraIncome: value };
    setBudgetData(updatedData);
    localStorage.setItem('budgetData', JSON.stringify(updatedData));
  };
  
  const handlePerSessionHoursChange = (value: string) => {
    const updatedData = { ...budgetData, perSessionHours: value };
    setBudgetData(updatedData);
    localStorage.setItem('budgetData', JSON.stringify(updatedData));
  };
  
  const handlePaycheckChange = (value: string) => {
    setPaycheck(value);
  };

  const handleRecalculateTaxes = () => {
    navigate('/tax-estimate');
  };
  
  const perSessionRate = getCurrentPerSessionRate();
  const perSessionIncome = Number(budgetData.perSessionHours || 0) * perSessionRate;
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle>Paycheck Calculator</CardTitle>
          </div>
          <CardDescription>
            Estimate your take-home pay based on tax calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {budgetData.takeHomeBiweekly ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Annual Take-Home</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {formatCurrency(budgetData.takeHomeAnnual)}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Take-Home</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {formatCurrency(budgetData.takeHomeMonthly)}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Bi-Weekly Paycheck</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {formatCurrency(budgetData.takeHomeBiweekly)}
                  </p>
                </div>
              </div>
              
              <Alert className="bg-muted/30 border-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <p className="mb-2">This amount has been calculated using all the information provided in your profile and tax estimates. We've created this estimate based on simple tax scenarios with standard deductions.</p>
                  <p>If your actual paycheck differs significantly, you may have additional deductions not accounted for in our estimates, or your tax situation may be different. Feel free to adjust the amount below to match your actual paycheck.</p>
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="actual-paycheck">Your Actual Bi-Weekly Paycheck</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="actual-paycheck"
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      value={paycheck}
                      onChange={(e) => handlePaycheckChange(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Adjust this to match your actual paycheck if needed</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="extra-income">Additional Annual Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="extra-income"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={budgetData.extraIncome || ""}
                          onChange={(e) => handleExtraIncomeChange(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Income not from your teaching position</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="per-session-hours">Per Session Hours (Annually)</Label>
                <div className="relative">
                  <Input
                    id="per-session-hours"
                    type="number"
                    placeholder="0"
                    value={budgetData.perSessionHours || ""}
                    onChange={(e) => handlePerSessionHoursChange(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">Current rate: ${perSessionRate.toFixed(2)}/hour</p>
                  {perSessionIncome > 0 && (
                    <p className="text-xs font-medium">Estimated income: {formatCurrency(perSessionIncome)}</p>
                  )}
                </div>
              </div>
              
              {(budgetData.extraIncome || budgetData.perSessionHours) && (
                <div className="text-center mt-4">
                  <p className="text-sm mb-2">You've added additional income. Recalculate your taxes to see the impact on take-home pay.</p>
                  <Button onClick={handleRecalculateTaxes} className="mt-2">
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate Taxes
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <Calculator className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                We need to calculate your estimated taxes first to show your take-home pay.
              </p>
              <Button onClick={handleRecalculateTaxes}>
                Calculate Taxes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
          <CardDescription>
            Track your income and expenses to manage your finances effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg text-foreground/60">
            Advanced budget management tools coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTools;
