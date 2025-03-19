
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BudgetTools = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tools</CardTitle>
        <CardDescription>
          Track your income and expenses to manage your finances effectively.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-lg text-foreground/60">
          Budget management tools coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default BudgetTools;
