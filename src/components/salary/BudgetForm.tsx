
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Calendar } from 'lucide-react';
import { PerSessionBudget, TimeframeType } from '@/types/perSession';
import { generateId } from '@/utils/perSessionUtils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface BudgetFormProps {
  onAddBudget: (budget: PerSessionBudget) => void;
}

const BudgetForm = ({ onAddBudget }: BudgetFormProps) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeType>('monthly');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !hours) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newBudget: PerSessionBudget = {
      id: generateId(),
      name,
      hours: Number(hours),
      timeframe,
      notes,
      endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
      createdAt: new Date().toISOString(),
    };
    
    onAddBudget(newBudget);
    
    // Reset form
    setName('');
    setHours('');
    setTimeframe('monthly');
    setNotes('');
    setDate(undefined);
    
    toast.success('Budget added successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Per Session Budget</CardTitle>
        <CardDescription>
          Set up budgets for different per session activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              placeholder="e.g., Tutoring, Test Prep, Coaching"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={timeframe} 
                onValueChange={(value) => setTimeframe(value as TimeframeType)}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="semester">Per Semester</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  id="endDate"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">Set an end date for this budget timeframe</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this budget"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
