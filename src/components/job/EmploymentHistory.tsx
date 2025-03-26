
import { useState, useEffect } from 'react';
import { z } from "zod";
import { FileText, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const historyEntrySchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  yearsOfService: z.string({
    required_error: "Please select years of service.",
  })
});

type HistoryEntry = z.infer<typeof historyEntrySchema>;

const EmploymentHistory = () => {
  const [employmentHistory, setEmploymentHistory] = useState<HistoryEntry[]>([]);
  const [newSchool, setNewSchool] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newYears, setNewYears] = useState("");
  
  useEffect(() => {
    const storedHistory = localStorage.getItem('employmentHistory');
    if (storedHistory) {
      setEmploymentHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addEmploymentHistory = () => {
    try {
      const newEntry = historyEntrySchema.parse({
        schoolName: newSchool,
        position: newPosition,
        yearsOfService: newYears
      });
      
      const updatedHistory = [...employmentHistory, newEntry];
      setEmploymentHistory(updatedHistory);
      localStorage.setItem('employmentHistory', JSON.stringify(updatedHistory));
      
      setNewSchool("");
      setNewPosition("");
      setNewYears("");
      
      toast("History Added", {
        description: "Employment history entry has been added."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: "Please fill out all fields correctly."
        });
      }
    }
  };

  const removeHistoryItem = (index: number) => {
    const updatedHistory = [...employmentHistory];
    updatedHistory.splice(index, 1);
    setEmploymentHistory(updatedHistory);
    localStorage.setItem('employmentHistory', JSON.stringify(updatedHistory));
    
    toast("Entry Removed", {
      description: "Employment history entry has been removed."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment History</CardTitle>
        <CardDescription>
          Track your career progression and employment history across schools and positions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Add New Employment History</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input 
                id="schoolName" 
                value={newSchool} 
                onChange={(e) => setNewSchool(e.target.value)}
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                value={newPosition} 
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Enter position title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfService">Years of Service</Label>
              <Select onValueChange={setNewYears} value={newYears}>
                <SelectTrigger>
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year} {year === 1 ? 'year' : 'years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addEmploymentHistory} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add to History
          </Button>
        </div>
        
        {employmentHistory.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Employment History</h3>
            <div className="border rounded-md divide-y">
              {employmentHistory.map((entry, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{entry.schoolName}</h4>
                    <p className="text-sm text-muted-foreground">{entry.position} • {entry.yearsOfService} {parseInt(entry.yearsOfService) === 1 ? 'year' : 'years'}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeHistoryItem(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="text-muted-foreground">
              No employment history entries yet. Add your first position above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmploymentHistory;
