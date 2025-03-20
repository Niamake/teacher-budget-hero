
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LineChart, Percent, AlertCircle, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DeferredCompSection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");
  const contributionLimit = 23500;
  
  // Calculate as a percentage of a sample $90k salary for illustration
  const sampleSalary = 90000;
  const contributionPercentage = annualContribution ? (Number(annualContribution) / sampleSalary) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-primary" />
            <CardTitle>457(b) Deferred Compensation Plan</CardTitle>
          </div>
          <CardDescription>
            The 457(b) plan is a supplemental retirement program that offers tax advantages similar to a 401(k) or 403(b) plan, but with additional flexibility for early withdrawals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              The annual contribution limit for a 457(b) plan is ${contributionLimit.toLocaleString()} for 2024. This limit is separate from your TDA contribution limit, allowing you to contribute to both plans simultaneously.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center mb-4 gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Current Account Value</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="457b-balance">Current 457(b) Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="457b-balance"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter your current NYCDCP 457(b) account balance from your most recent statement</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4 gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Planned Contributions</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="457b-contribution">Annual Contribution Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="457b-contribution"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={annualContribution}
                      onChange={(e) => setAnnualContribution(e.target.value)}
                      max={contributionLimit}
                    />
                  </div>
                  
                  {Number(annualContribution) > 0 && (
                    <div className="mt-4 bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Estimated Contribution:</strong> Approximately <span className="text-primary font-medium">{contributionPercentage.toFixed(1)}%</span> of a $90,000 annual salary
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Per Pay Period:</strong> <span className="font-medium">${(Number(annualContribution) / 24).toFixed(2)}</span> (semi-monthly)
                      </p>
                    </div>
                  )}
                  
                  {Number(annualContribution) > contributionLimit && (
                    <p className="text-sm text-destructive mt-2">
                      This amount exceeds the annual contribution limit of ${contributionLimit.toLocaleString()}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeferredCompSection;
