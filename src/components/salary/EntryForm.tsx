
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PerSessionBudget, PerSessionEntry } from '@/types/perSession';
import { generateId } from '@/utils/perSessionUtils';
import { toast } from 'sonner';

interface EntryFormProps {
  budgets: PerSessionBudget[];
  onAddEntry: (entry: PerSessionEntry) => void;
}

const EntryForm = ({ budgets, onAddEntry }: EntryFormProps) => {
  const [budgetId, setBudgetId] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<PerSessionBudget | null>(null);

  useEffect(() => {
    if (budgetId && budgets.length > 0) {
      const budget = budgets.find(b => b.id === budgetId);
      setSelectedBudget(budget || null);
    } else {
      setSelectedBudget(null);
    }
  }, [budgetId, budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetId || !date || !hours) {
      toast.error('Please fill in all required fields');
      return;
    }

    const hoursValue = parseFloat(hours);
    
    const newEntry: PerSessionEntry = {
      id: generateId(),
      budgetId,
      date: date.toISOString(),
      hours: hoursValue,
      description,
      createdAt: new Date().toISOString(),
    };
    
    onAddEntry(newEntry);
    
    // Reset form
    setHours('');
    setDescription('');
    
    toast.success('Hours logged successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log Per Session Hours</CardTitle>
        <CardDescription>
          Record your per session hours to track against your budgets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Select Activity</Label>
            <Select
              value={budgetId}
              onValueChange={setBudgetId}
            >
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Worked</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="0.0"
                className="pl-10"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            {selectedBudget && (
              <p className="text-xs text-muted-foreground mt-1">
                Budget: {selectedBudget.hours} hours {getTimeframeLabel(selectedBudget.timeframe)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what you did"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Log Hours
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EntryForm;
