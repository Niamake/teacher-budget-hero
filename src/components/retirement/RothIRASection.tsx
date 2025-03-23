
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Wallet, Percent, AlertCircle, Calculator, TrendingUp, Info, Save, Table as TableIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { Card as ProjectionCard } from "@/components/ui/card";

interface RothIRASectionProps {
  savedData?: {
    currentBalance: string;
    annualContribution: string;
    returnRate: number;
  };
  onSave?: (data: { currentBalance: string; annualContribution: string; returnRate: number }) => void;
}

const RothIRASection = ({ savedData, onSave }: RothIRASectionProps) => {
  const [currentBalance, setCurrentBalance] = useState(savedData?.currentBalance || "");
  const [annualContribution, setAnnualContribution] = useState(savedData?.annualContribution || "");
  const [returnRate, setReturnRate] = useState(savedData?.returnRate || 8); // Default 8%
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const contributionLimit = 7000;
  
  useEffect(() => {
    // Calculate projection data whenever inputs change
    if (currentBalance || annualContribution || returnRate) {
      const startingBalance = Number(currentBalance) || 0;
      const yearlyContribution = Number(annualContribution) || 0;
      const rate = returnRate / 100; // Convert percentage to decimal
      const projectionYears = 50;
      
      const data = [];
      let balance = startingBalance;
      
      for (let year = 0; year <= projectionYears; year++) {
        if (year > 0) {
          // Add yearly contribution and apply continuous compounding growth
          balance = (balance + yearlyContribution) * Math.exp(rate);
        }
        
        data.push({
          year: year,
          balance: Math.round(balance),
          formattedBalance: formatCurrency(Math.round(balance))
        });
      }
      
      setProjectionData(data);
    }
  }, [currentBalance, annualContribution, returnRate]);
  
  // Track changes to enable save button
  useEffect(() => {
    if (savedData) {
      setHasChanges(
        currentBalance !== savedData.currentBalance || 
        annualContribution !== savedData.annualContribution ||
        returnRate !== savedData.returnRate
      );
    } else {
      setHasChanges(currentBalance !== "" || annualContribution !== "" || returnRate !== 8);
    }
  }, [currentBalance, annualContribution, returnRate, savedData]);
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        currentBalance,
        annualContribution,
        returnRate
      });
      setHasChanges(false);
    }
  };

  // Get milestone data points for projection highlights
  const getMilestoneData = () => {
    const milestones = [5, 10, 20, 30, 40];
    return milestones.map(year => {
      const dataPoint = projectionData[year];
      return dataPoint ? {
        year,
        balance: dataPoint.balance,
        formattedBalance: dataPoint.formattedBalance
      } : null;
    }).filter(Boolean);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <CardTitle>Roth IRA</CardTitle>
            </div>
            {hasChanges && onSave && (
              <Button 
                size="sm" 
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            )}
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
          
          {(Number(currentBalance) > 0 || Number(annualContribution) > 0) && (
            <>
              <div className="mt-8 space-y-6">
                <div className="flex items-center mb-2 gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Projected Roth IRA Growth</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <Label htmlFor="roth-return-rate" className="mb-2 block">
                      Expected Annual Return Rate: <span className="font-medium text-primary">{returnRate}%</span>
                    </Label>
                    <Slider 
                      id="roth-return-rate"
                      min={1} 
                      max={15} 
                      step={0.5}
                      value={[returnRate]} 
                      onValueChange={(value) => setReturnRate(value[0])}
                      className="py-4"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      The S&P 500 has historically averaged 7-10% annual returns over the long term. Adjust this value to model different market scenarios.
                    </p>
                  </div>
                
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This projection uses continuous compounding to model market returns. Past performance does not guarantee future results. Remember that Roth IRA withdrawals are tax-free in retirement, which may make this account particularly valuable.
                    </AlertDescription>
                  </Alert>
                </div>
                
                {/* Key Projection Milestones at the top */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                  {getMilestoneData().map((milestone) => (
                    <ProjectionCard key={milestone.year} className="bg-muted/30">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground">Year {milestone.year}</p>
                        <p className="text-primary font-bold">{milestone.formattedBalance}</p>
                      </CardContent>
                    </ProjectionCard>
                  ))}
                </div>
                
                <div className="h-[300px] w-full">
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
                        <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#rothGradient)" 
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </div>
              
              {/* Separate card for the detailed projection table */}
              <div className="mt-8">
              <Card className="mt-10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Detailed Projection Table </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
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
                  <p className="text-xs text-muted-foreground mt-3">* Age is estimated based on your current age plus years in the future</p>
                </CardContent>
              </Card>
            </div>
            </>
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

export default RothIRASection;
