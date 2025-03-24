
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/taxCalculations';

const BudgetTools = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState<any>({
    takeHomeAnnual: 0,
    takeHomeMonthly: 0,
    takeHomeSemiMonthly: 0
  });
  const [paycheck, setPaycheck] = useState<string>("");
  
  useEffect(() => {
    // Load budget data from localStorage
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const parsedData = JSON.parse(storedBudgetData);
        setBudgetData(parsedData);
        
        // Set initial paycheck amount from the semi-monthly take-home pay
        if (parsedData.takeHomeSemiMonthly) {
          setPaycheck(Math.round(parsedData.takeHomeSemiMonthly).toString());
        } else if (parsedData.takeHomeBiweekly) {
          // For backward compatibility with older data structure
          setPaycheck(Math.round(parsedData.takeHomeBiweekly).toString());
        }
      } catch (error) {
        console.error("Failed to parse budget data:", error);
      }
    }
  }, []);
  
  const handlePaycheckChange = (value: string) => {
    setPaycheck(value);
  };

  const handleRecalculateTaxes = () => {
    navigate('/tax-estimate');
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle>Paycheck Calculator</CardTitle>
          </div>
          <CardDescription>
            Estimate your take-home pay based on tax calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(budgetData.takeHomeSemiMonthly > 0 || budgetData.takeHomeBiweekly > 0) ? (
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
                  <p className="text-sm font-medium text-muted-foreground mb-2">Semi-Monthly Paycheck</p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {formatCurrency(budgetData.takeHomeSemiMonthly || budgetData.takeHomeBiweekly)}
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
              
              <div className="space-y-2">
                <Label htmlFor="actual-paycheck">Your Actual Semi-Monthly Paycheck</Label>
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
    </div>
  );
};

export default BudgetTools;
