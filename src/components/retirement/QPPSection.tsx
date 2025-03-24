
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, Calculator } from "lucide-react";
import { useState, useEffect } from "react";

const QPPSection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [contributionRate, setContributionRate] = useState<number | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number | null>(null);
  const [pensionInfo, setPensionInfo] = useState({
    pensionTier: "6",
    completedMandatory: false
  });
  const [grossSalary, setGrossSalary] = useState(0);

  useEffect(() => {
    // Load QPP data from localStorage
    const qppData = localStorage.getItem('qppData');
    if (qppData) {
      try {
        const parsedData = JSON.parse(qppData);
        setCurrentBalance(parsedData.currentBalance || "");
        setPensionInfo({
          pensionTier: parsedData.pensionTier || "6",
          completedMandatory: parsedData.completedMandatory || false
        });
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }

    // Load salary from teacher profile if available
    const teacherProfile = localStorage.getItem('teacherProfile');
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        const salary = profileData.estimatedSalary || profileData.salary || 0;
        setGrossSalary(Number(salary));
        
        // Save to qppData if it doesn't exist or update it
        updateQPPData({ currentBalance }, salary);
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }
  }, []);

  useEffect(() => {
    calculateContribution();
  }, [pensionInfo, grossSalary]);

  const calculateContribution = () => {
    let rate = 0;
    const { pensionTier, completedMandatory } = pensionInfo;

    if (pensionTier === "4") {
      rate = completedMandatory ? 0 : 3;
    } else if (pensionTier === "5") {
      rate = 3.5;
    } else if (pensionTier === "6") {
      if (grossSalary <= 45000) {
        rate = 3;
      } else if (grossSalary <= 55000) {
        rate = 3.5;
      } else if (grossSalary <= 75000) {
        rate = 4.5;
      } else if (grossSalary <= 100000) {
        rate = 5.75;
      } else {
        rate = 6;
      }
    }

    setContributionRate(rate);
    const amount = grossSalary * (rate / 100);
    setContributionAmount(amount);
    
    // Update QPP data with new contribution rate and amount
    updateQPPData({ contributionRate: rate, contributionAmount: amount });
  };

  const updateQPPData = (newData: any, salary?: number) => {
    const existingData = localStorage.getItem('qppData');
    const qppData = existingData ? JSON.parse(existingData) : {};
    
    const updatedData = { 
      ...qppData, 
      ...newData, 
      currentBalance: currentBalance || qppData.currentBalance || "" 
    };
    
    localStorage.setItem('qppData', JSON.stringify(updatedData));
  };

  const handleBalanceChange = (value: string) => {
    setCurrentBalance(value);
    updateQPPData({ currentBalance: value });
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Qualified Pension Plan (QPP)</CardTitle>
          </div>
          <CardDescription>
            Your TRS pension plan is a defined benefit plan that provides a lifetime annuity based on your final average salary and years of service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center mb-4 gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Current Account Value</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qpp-balance">Current QPP Estimated Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="qpp-balance"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={currentBalance}
                      onChange={(e) => handleBalanceChange(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter your estimated pension value from your TRS account</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4 gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">QPP Information</h3>
              </div>
              <div className="space-y-4 bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Automatic Contributions:</strong> Contributions to the QPP are mandatory and are automatically deducted from your paycheck.
                </p>
                <p className="text-sm">
                  <strong>Fixed Contribution Rate:</strong> Members contribute 3-8% of their salary depending on their tier and join date.
                </p>
                <p className="text-sm">
                  <strong>Vesting Period:</strong> You need 5-10 years of credited service to be vested, depending on your tier.
                </p>
                <p className="text-sm">
                  <strong>Benefit Calculation:</strong> Your pension is typically calculated based on your final average salary and years of service.
                </p>
              </div>
            </div>
          </div>

          {contributionRate !== null && contributionAmount !== null && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Your QPP Contribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contribution Rate</p>
                  <p className="text-2xl font-bold">{contributionRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your pension tier {pensionInfo.pensionTier} status
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="text-2xl font-bold">{formatCurrency(contributionAmount)}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(contributionAmount / 24).toFixed(2)} per paycheck (24 pay periods)
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QPPSection;
