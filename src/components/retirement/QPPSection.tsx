
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Shield, Clock, Calculator, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface QPPFormValues {
  pensionTier: "4" | "5" | "6";
  completedMandatory: boolean;
  grossSalary: string;
}

const QPPSection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [contributionRate, setContributionRate] = useState<number | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number | null>(null);
  
  const form = useForm<QPPFormValues>({
    defaultValues: {
      pensionTier: "6",
      completedMandatory: false,
      grossSalary: ""
    }
  });

  useEffect(() => {
    // Load salary from teacher profile if available
    const teacherProfile = localStorage.getItem('teacherProfile');
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        if (profileData.estimatedSalary) {
          form.setValue("grossSalary", profileData.estimatedSalary.toString());
        } else if (profileData.salary) {
          form.setValue("grossSalary", profileData.salary.toString());
        }
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }

    // Load QPP data if available
    const qppData = localStorage.getItem('qppData');
    if (qppData) {
      try {
        const parsedData = JSON.parse(qppData);
        setCurrentBalance(parsedData.currentBalance || "");
        form.setValue("pensionTier", parsedData.pensionTier || "6");
        form.setValue("completedMandatory", parsedData.completedMandatory || false);
        
        // Calculate contribution rate and amount
        calculateContribution(
          parsedData.pensionTier, 
          parsedData.completedMandatory, 
          form.getValues("grossSalary")
        );
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }
  }, []);

  const calculateContribution = (
    tier: string, 
    completedMandatory: boolean, 
    grossSalary: string
  ) => {
    const salary = Number(grossSalary) || 0;
    let rate = 0;

    if (tier === "4") {
      rate = completedMandatory ? 0 : 3;
    } else if (tier === "5") {
      rate = 3.5;
    } else if (tier === "6") {
      if (salary <= 45000) {
        rate = 3;
      } else if (salary <= 55000) {
        rate = 3.5;
      } else if (salary <= 75000) {
        rate = 4.5;
      } else if (salary <= 100000) {
        rate = 5.75;
      } else {
        rate = 6;
      }
    }

    setContributionRate(rate);
    setContributionAmount(salary * (rate / 100));
  };

  const onSubmit = (data: QPPFormValues) => {
    calculateContribution(data.pensionTier, data.completedMandatory, data.grossSalary);
    
    // Save to localStorage
    const qppData = {
      currentBalance,
      pensionTier: data.pensionTier,
      completedMandatory: data.completedMandatory,
      contributionRate: contributionRate
    };
    
    localStorage.setItem('qppData', JSON.stringify(qppData));
    toast.success("Saved your QPP information");
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
              <CardTitle>Determine Your QPP Contribution</CardTitle>
              <CardDescription>
                Your contribution rate is determined by your pension tier and salary level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pensionTier"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Which pension tier are you in?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="4" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tier IV (joined TRS before January 1, 2010)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tier V (joined TRS between January 1, 2010 and March 31, 2012)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="6" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tier VI (joined TRS on or after April 1, 2012)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("pensionTier") === "4" && (
                    <FormField
                      control={form.control}
                      name="completedMandatory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have completed my mandatory 3% contributions for 10 years
                            </FormLabel>
                            <FormDescription>
                              Tier IV members must contribute 3% of their salary until they complete 10 years of service
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

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
                        Based on your pension tier {form.getValues("pensionTier")} status
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
        </CardContent>
      </Card>
    </div>
  );
};

export default QPPSection;
