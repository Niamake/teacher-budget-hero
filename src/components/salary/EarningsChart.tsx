
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PerSessionEntry } from '@/types/perSession';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { calculateMonthlyEarnings } from '@/utils/perSessionUtils';
import { getCurrentPerSessionRate } from '@/utils/taxCalculations';
import { formatCurrency } from '@/utils/taxCalculations';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface EarningsChartProps {
  entries: PerSessionEntry[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }

  return null;
};

const EarningsChart = ({ entries }: EarningsChartProps) => {
  const [timeRange, setTimeRange] = useState<string>('6');
  const perSessionRate = getCurrentPerSessionRate();
  const monthlyData = calculateMonthlyEarnings(entries, perSessionRate);
  
  const filteredData = monthlyData.slice(-parseInt(timeRange));
  
  const totalEarnings = filteredData.reduce((sum, month) => sum + month.amount, 0);

  return (
    <Card className="col-span-full">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle className="text-destructive font-semibold">Important Tax Information</AlertTitle>
        <AlertDescription className="text-sm">
          <p className="mb-2">
            When submitting less than 20 hours of Per Session work at once, the Department of Education may not withhold enough taxes from your payment. You are responsible for setting aside money for taxes in this case.
          </p>
          <p>
            We are not tax specialists. Please consult a qualified tax professional for advice on your specific situation. We recommend saving about 50% of any Per Session payment without proper tax withholding in a High-Yield Savings Account to cover potential tax obligations in the next filing period.
          </p>
        </AlertDescription>
      </Alert>
      
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg">Earnings Overview</CardTitle>
            <CardDescription>
              Visualize your per session earnings over time
            </CardDescription>
          </div>
          
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 months</SelectItem>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
              <SelectItem value="1000">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-2">
          <div className="text-sm font-medium">
            Total: {formatCurrency(totalEarnings)}
          </div>
        </div>
        
        {filteredData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No earnings data available. Start logging your hours!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
