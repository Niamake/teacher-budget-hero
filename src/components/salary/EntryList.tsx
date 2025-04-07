
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PerSessionBudget, PerSessionEntry } from '@/types/perSession';
import { format, parseISO } from 'date-fns';
import { getCurrentPerSessionRate } from '@/utils/taxCalculations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Filter } from 'lucide-react';
import { formatCurrency } from '@/utils/taxCalculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EntryListProps {
  entries: PerSessionEntry[];
  budgets: PerSessionBudget[];
  onDeleteEntry: (id: string) => void;
}

const EntryList = ({ entries, budgets, onDeleteEntry }: EntryListProps) => {
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const perSessionRate = getCurrentPerSessionRate();
  
  const getBudgetName = (budgetId: string): string => {
    const budget = budgets.find(b => b.id === budgetId);
    return budget ? budget.name : 'Unknown';
  };
  
  const filteredEntries = entries
    .filter(entry => selectedBudget === 'all' || entry.budgetId === selectedBudget)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalEarnings = totalHours * perSessionRate;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg">Per Session Hours Log</CardTitle>
            <CardDescription>
              Track your logged hours and earnings
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Activity</h4>
                    <Select
                      value={selectedBudget}
                      onValueChange={setSelectedBudget}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        {budgets.map((budget) => (
                          <SelectItem key={budget.id} value={budget.id}>
                            {budget.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sort By</h4>
                    <Select
                      value={sortOrder}
                      onValueChange={(value: string) => setSortOrder(value as 'newest' | 'oldest')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEntries.length > 0 ? (
          <>
            <div className="rounded-md border mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(parseISO(entry.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {getBudgetName(entry.budgetId)}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.hours.toFixed(1)}</TableCell>
                      <TableCell>{formatCurrency(entry.hours * perSessionRate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-border/50">
              <div>
                <span className="font-medium">{filteredEntries.length}</span> entries, 
                <span className="font-medium ml-1">{totalHours.toFixed(1)}</span> total hours
              </div>
              <div className="font-medium">
                Total: {formatCurrency(totalEarnings)}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No entries found. Start logging your hours!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntryList;
