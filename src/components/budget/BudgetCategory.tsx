
import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, PlusCircle, AlertCircle, InfoIcon } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/taxCalculations';
import { checkBudgetLimit } from '@/utils/budgetUtils';

interface BudgetCategoryProps {
  categoryId: string;
  categoryName: string;
  items: any[];
  recommendedPercentage: number;
  totalIncome: number;
  onAddItem: (item: any) => void;
  onDeleteItem: (id: string) => void;
  onUpdateLimit: (categoryId: string, limit: string) => void;
  description: string;
  limit?: string;
}

const BudgetCategory = ({
  categoryId,
  categoryName,
  items,
  recommendedPercentage,
  totalIncome,
  onAddItem,
  onDeleteItem,
  onUpdateLimit,
  description,
  limit
}: BudgetCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [categoryLimit, setCategoryLimit] = useState(limit || '');
  
  const totalCategoryAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const recommendedAmount = (recommendedPercentage / 100) * totalIncome;
  const currentPercentage = totalIncome > 0 ? (totalCategoryAmount / totalIncome) * 100 : 0;
  
  const { status, percentage } = checkBudgetLimit(totalCategoryAmount, Number(categoryLimit));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newItemName || !newItemAmount) return;
    
    // Check if adding this item would exceed the limit
    if (categoryLimit && 
        Number(categoryLimit) > 0 && 
        totalCategoryAmount + Number(newItemAmount) > Number(categoryLimit)) {
      // Show warning but still allow adding
      if (!confirm('Adding this item will exceed your category limit. Do you still want to add it?')) {
        return;
      }
    }
    
    onAddItem({
      id: Date.now().toString(),
      category: categoryName,
      categoryId,
      name: newItemName,
      amount: newItemAmount,
      type: 'expense',
    });
    
    setNewItemName('');
    setNewItemAmount('');
  };
  
  const handleLimitChange = (e) => {
    setCategoryLimit(e.target.value);
    // Only update after a delay to avoid too many updates
    if (e.target.value === '') {
      onUpdateLimit(categoryId, '');
    }
  };
  
  const handleLimitBlur = () => {
    onUpdateLimit(categoryId, categoryLimit);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer py-3" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-md md:text-lg">{categoryName}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge variant="outline" className="ml-2">
              {items.length} items
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">
              {formatCurrency(totalCategoryAmount)}
            </span>
            {isExpanded ? 
              <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            }
          </div>
        </div>
        {!isExpanded && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Current: {currentPercentage.toFixed(1)}%</span>
              <span>Recommended: {recommendedPercentage}%</span>
            </div>
            <Progress 
              value={currentPercentage} 
              max={recommendedPercentage * 1.5} 
              className={`h-2 ${
                currentPercentage > recommendedPercentage * 1.2 ? 'bg-red-500' : 
                currentPercentage > recommendedPercentage ? 'bg-amber-500' : ''
              }`}
            />
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-3 border-b">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Recommended: {formatCurrency(recommendedAmount)}</span>
                  <span className="font-medium">Current: {formatCurrency(totalCategoryAmount)}</span>
                </div>
                <Progress 
                  value={currentPercentage} 
                  max={recommendedPercentage * 1.5} 
                  className={`h-2 ${
                    currentPercentage > recommendedPercentage * 1.2 ? 'bg-red-500' : 
                    currentPercentage > recommendedPercentage ? 'bg-amber-500' : ''
                  }`}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Recommended: {recommendedPercentage}% of monthly income ({currentPercentage.toFixed(1)}% used)
                </div>
              </div>
              
              <div className="w-full md:w-32">
                <Label htmlFor={`limit-${categoryId}`} className="text-sm">Category Limit</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id={`limit-${categoryId}`}
                    type="number"
                    placeholder="Optional"
                    className="pl-8"
                    value={categoryLimit}
                    onChange={handleLimitChange}
                    onBlur={handleLimitBlur}
                  />
                </div>
                
                {Number(categoryLimit) > 0 && (
                  <div className="mt-1">
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${
                        status === 'exceeded' ? 'bg-red-500' : 
                        status === 'approaching' ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    />
                    
                    {status === 'exceeded' && (
                      <span className="budget-limit-warning">Limit exceeded!</span>
                    )}
                    {status === 'approaching' && (
                      <span className="budget-limit-approaching">Approaching limit</span>
                    )}
                    {status === 'within' && (
                      <span className="budget-within-limit">Within limit</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center">
                      <span className="font-medium text-destructive mr-3">{formatCurrency(Number(item.amount))}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No items in this category yet</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label htmlFor={`item-name-${categoryId}`}>Description</Label>
                <Input
                  id={`item-name-${categoryId}`}
                  placeholder="e.g., Rent, Groceries"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`item-amount-${categoryId}`}>Amount</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id={`item-amount-${categoryId}`}
                    type="number"
                    placeholder="0"
                    className="pl-8"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!newItemName || !newItemAmount}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BudgetCategory;
