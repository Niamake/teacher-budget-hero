import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Shield, Clock, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import PensionCalculator from "./PensionCalculator";

interface QPPFormValues {
  grossSalary: string;
}

// Function to calculate QPP contribution based on tier and salary
const calculateContribution = (
  tier: string, 
  completedMandatory: boolean, 
  grossSalary: number
): { rate: number, amount: number } => {
  let rate = 0;

  if (tier === "4") {
    rate = completedMandatory ? 0 : 3;
  } else if (tier === "5") {
    rate = 3.5;
  } else if (tier === "6") {
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

  const amount = grossSalary * (rate / 100);
  return { rate, amount };
};

const QPPSection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [contributionRate, setContributionRate] = useState<number | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number | null>(null);
  const [pensionTier, setPensionTier] = useState<string>("6");
  const [completedMandatory, setCompletedMandatory] = useState<boolean>(false);
  
  const form = useForm<QPPFormValues>({
    defaultValues: {
      grossSalary: ""
    }
  });

  useEffect(() => {
    const teacherProfile = localStorage.getItem('teacherProfile');
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        
        if (profileData.pensionTier) {
          setPensionTier(profileData.pensionTier);
          setCompletedMandatory(profileData.completedMandatory || false);
        }
        
        if (profileData.estimatedSalary) {
          form.setValue("grossSalary", profileData.estimatedSalary.toString());
          updateContribution(profileData.estimatedSalary.toString());
        } else if (profileData.salary) {
          form.setValue("grossSalary", profileData.salary.toString());
          updateContribution(profileData.salary.toString());
        }
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }

    const qppData = localStorage.getItem('qppData');
    if (qppData) {
      try {
        const parsedData = JSON.parse(qppData);
        setCurrentBalance(parsedData.currentBalance || "");
        
        if (parsedData.pensionTier) {
          setPensionTier(parsedData.pensionTier);
          setCompletedMandatory(parsedData.completedMandatory || false);
        }
        
        updateContribution(form.getValues("grossSalary"));
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }
  }, []);

  const updateContribution = (grossSalary: string) => {
    const salary = Number(grossSalary) || 0;
    const { rate, amount } = calculateContribution(pensionTier, completedMandatory, salary);
    
    setContributionRate(rate);
    setContributionAmount(amount);
  };

  const onSubmit = (data: QPPFormValues) => {
    updateContribution(data.grossSalary);
    
    const qppData = {
      currentBalance,
      pensionTier,
      completedMandatory,
      contributionRate
    };
    
    localStorage.setItem('qppData', JSON.stringify(qppData));
    toast.success("Saved your QPP information");
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.grossSalary) {
        updateContribution(value.grossSalary);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, pensionTier, completedMandatory]);

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
                      onChange={(e) => setCurrentBalance(e.target.value)}
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your QPP Contribution</CardTitle>
              <CardDescription>
                Your contribution is automatically calculated based on your pension tier and salary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="grossSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Gross Salary</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This value is auto-filled based on your estimated salary from your profile, but you can modify it to see different scenarios
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium mb-2">Your Pension Information</h3>
                    <p className="text-sm mb-2">
                      <strong>Pension Tier:</strong> Tier {pensionTier}
                      {pensionTier === "4" && (
                        <span> ({completedMandatory ? "Completed mandatory contributions" : "Still making mandatory contributions"})</span>
                      )}
                    </p>
                    <p className="text-sm">
                      You can update your pension tier in the Career Profile page under Job Information.
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Calculate & Save
                  </Button>
                </form>
              </Form>

              {contributionRate !== null && contributionAmount !== null && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Your QPP Contribution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contribution Rate</p>
                      <p className="text-2xl font-bold">{contributionRate}%</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your pension tier {pensionTier} status
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
          
          <PensionCalculator />
        </CardContent>
      </Card>
    </div>
  );
};

export default QPPSection;
