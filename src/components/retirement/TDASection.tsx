
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { DollarSign, Percent, AlertCircle, Calculator, TrendingUp, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TDASection = () => {
  const [currentBalance, setCurrentBalance] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const contributionLimit = 23500;
  const fixedReturnRate = 0.07; // 7% fixed rate
  
  // Calculate as a percentage of a sample $90k salary for illustration
  const sampleSalary = 90000;
  const contributionPercentage = annualContribution ? (Number(annualContribution) / sampleSalary) * 100 : 0;
  
  useEffect(() => {
    // Calculate projection data whenever inputs change
    if (currentBalance || annualContribution) {
      const startingBalance = Number(currentBalance) || 0;
      const yearlyContribution = Number(annualContribution) || 0;
      const projectionYears = 50;
      
      const data = [];
      let balance = startingBalance;
      
      for (let year = 0; year <= projectionYears; year++) {
        if (year > 0) {
          // Add yearly contribution and apply fixed rate return (compounded annually)
          balance = (balance + yearlyContribution) * (1 + fixedReturnRate);
        }
        
        data.push({
          year: year,
          balance: Math.round(balance),
          formattedBalance: formatCurrency(Math.round(balance))
        });
      }
      
      setProjectionData(data);
    }
  }, [currentBalance, annualContribution]);
  
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
            <DollarSign className="h-6 w-6 text-primary" />
            <CardTitle>Tax Deferred Annuity (TDA)</CardTitle>
          </div>
          <CardDescription>
            The TDA program is a voluntary 403(b) retirement plan that allows you to save additional money for retirement on a tax-deferred basis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <p>The annual contribution limit for a TDA is ${contributionLimit.toLocaleString()} for 2024 for those under 50.</p>
              <p className="mt-1.5">Additional catch-up contributions are allowed based on age:</p>
              <ul className="mt-1 list-disc list-inside text-sm">
                <li>Age 50-59: Additional $7,500 (total $31,000)</li>
                <li>Age 60-63: Additional $11,250 (total $34,750)</li>
                <li>Age 64+: Additional $7,500 (total $31,000)</li>
              </ul>
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
                  <Label htmlFor="tda-balance">Current TDA Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="tda-balance"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter your current TDA account balance from your most recent statement</p>
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
                  <Label htmlFor="tda-contribution">Annual Contribution Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="tda-contribution"
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
                      This amount exceeds the annual contribution limit of ${contributionLimit.toLocaleString()} for those under 50.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {(Number(currentBalance) > 0 || Number(annualContribution) > 0) && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center mb-2 gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Projected TDA Growth</h3>
              </div>
              
              <Alert className="bg-muted/50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This chart represents the projected growth of a TDA account invested in the FIXED RATE option only, which currently offers 7% per year compounded annually. While the TDA offers other investment options, this projection is based solely on the fixed rate option.
                </AlertDescription>
              </Alert>
              
              <div className="h-[300px] w-full mt-6">
                <ChartContainer
                  config={{
                    balance: {
                      theme: {
                        light: "rgb(var(--primary))",
                        dark: "rgb(var(--primary))",
                      },
                    },
                  }}
                >
                  <AreaChart
                    data={projectionData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="tdaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                      ticks={[0, 10, 20, 30, 40, 50]}
                    />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 1000000) {
                          return `$${(value / 1000000).toFixed(0)}M`;
                        } else if (value >= 1000) {
                          return `$${(value / 1000).toFixed(0)}K`;
                        }
                        return `$${value}`;
                      }}
                    />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="rgb(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#tdaGradient)" 
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-3">Key Projection Milestones</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Age*</TableHead>
                      <TableHead className="text-right">Projected Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[5, 10, 20, 30, 40].map((milestone) => {
                      const dataPoint = projectionData[milestone];
                      return dataPoint ? (
                        <TableRow key={milestone}>
                          <TableCell>{milestone}</TableCell>
                          <TableCell>Current + {milestone}</TableCell>
                          <TableCell className="text-right font-medium">{dataPoint.formattedBalance}</TableCell>
                        </TableRow>
                      ) : null;
                    })}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2">* Age is estimated based on your current age plus years in the future</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">Year {data.year}</p>
        <p className="text-primary font-bold">{data.formattedBalance}</p>
      </div>
    );
  }
  return null;
};

export default TDASection;
