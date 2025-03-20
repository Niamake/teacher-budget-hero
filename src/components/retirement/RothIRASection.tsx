
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Wallet, Percent, AlertCircle, Calculator } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RothIRASection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");
  const contributionLimit = 7000;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <CardTitle>Roth IRA</CardTitle>
          </div>
          <CardDescription>
            A Roth IRA allows you to contribute after-tax dollars and withdraw the money tax-free in retirement, providing tax diversification for your retirement portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              The annual contribution limit for a Roth IRA is ${contributionLimit.toLocaleString()} for 2024. Unlike the TDA and 457(b) plans, a Roth IRA is not administered through your employer.
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
                  <Label htmlFor="roth-balance">Current Roth IRA Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="roth-balance"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter your current Roth IRA balance from your most recent statement</p>
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
                  <Label htmlFor="roth-contribution">Annual Contribution Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="roth-contribution"
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
                        <strong>Monthly Contribution:</strong> <span className="font-medium">${(Number(annualContribution) / 12).toFixed(2)}</span>
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Weekly Contribution:</strong> <span className="font-medium">${(Number(annualContribution) / 52).toFixed(2)}</span>
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

export default RothIRASection;
