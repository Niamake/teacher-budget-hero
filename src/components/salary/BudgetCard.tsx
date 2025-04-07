
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PerSessionBudget, PerSessionEntry } from '@/types/perSession';
import { Progress } from '@/components/ui/progress';
import { calculateRemainingHours, calculateUsagePercentage, getTimeframeLabel, formatBudgetDate } from '@/utils/perSessionUtils';
import { Calendar } from 'lucide-react';

interface BudgetCardProps {
  budget: PerSessionBudget;
  entries: PerSessionEntry[];
  onDelete: (id: string) => void;
}

const BudgetCard = ({ budget, entries, onDelete }: BudgetCardProps) => {
  const remainingHours = calculateRemainingHours(budget, entries);
  const usagePercentage = calculateUsagePercentage(budget, entries);
  const timeframeLabel = getTimeframeLabel(budget.timeframe);
  
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{budget.name}</CardTitle>
            <CardDescription>
              {budget.hours} hours {timeframeLabel}
            </CardDescription>
          </div>
          <button 
            onClick={() => onDelete(budget.id)}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Remove
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${getProgressColor(usagePercentage)}`} 
            max={100}
          />
          
          <div className="flex justify-between text-sm">
            <span>
              {remainingHours.toFixed(1)} hours remaining
            </span>
            <span className="font-medium">
              {Math.min(usagePercentage, 100).toFixed(0)}% used
            </span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Ends: {formatBudgetDate(budget.endDate)}</span>
          </div>
          
          {budget.notes && (
            <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
              {budget.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
