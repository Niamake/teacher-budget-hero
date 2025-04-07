
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { PerSessionBudget, TimeframeType } from '@/types/perSession';
import { generateId } from '@/utils/perSessionUtils';
import { toast } from 'sonner';

interface BudgetFormProps {
  onAddBudget: (budget: PerSessionBudget) => void;
}

const BudgetForm = ({ onAddBudget }: BudgetFormProps) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeType>('monthly');
  const [notes, setNotes] = useState('');

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
      createdAt: new Date().toISOString(),
    };
    
    onAddBudget(newBudget);
    
    // Reset form
    setName('');
    setHours('');
    setTimeframe('monthly');
    setNotes('');
    
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
