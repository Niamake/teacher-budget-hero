
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Shield, Clock, Calculator } from "lucide-react";

const QPPSection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  
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
        </CardContent>
      </Card>
    </div>
  );
};

export default QPPSection;
