
import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, BadgeDollarSign, BriefcaseIcon, Calculator, FileText, InfoIcon, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

// Career profile form schema - making required fields
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  employeeID: z.string().optional(),
  school: z.string().optional(),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  salaryStep: z.string({
    required_error: "Please select a salary step.",
  }),
  yearsOfService: z.string({
    required_error: "Please select years of service.",
  }),
  hiringDate: z.date().optional(),
  differential: z.string({
    required_error: "Please select a salary differential.",
  }),
  certifications: z.string().min(1, {
    message: "Please enter your certifications.",
  }),
  tenured: z.boolean(),
  additionalNotes: z.string().optional(),
});

// Employment history entry schema
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

const JobInfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSaved, setIsSaved] = useState(false);
  const [employmentHistory, setEmploymentHistory] = useState<HistoryEntry[]>([]);
  const [newSchool, setNewSchool] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newYears, setNewYears] = useState("");

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      employeeID: "",
      school: "",
      position: "",
      salaryStep: "",
      yearsOfService: "",
      differential: "",
      certifications: "",
      tenured: false,
      additionalNotes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Store values in localStorage for persistence
    localStorage.setItem('teacherProfile', JSON.stringify(values));
    
    setIsSaved(true);
    toast({
      title: "Profile Saved",
      description: "Your career profile has been saved successfully."
    });
    
    setTimeout(() => setIsSaved(false), 3000);
  }

  const addEmploymentHistory = () => {
    try {
      // Validate the new entry
      const newEntry = historyEntrySchema.parse({
        schoolName: newSchool,
        position: newPosition,
        yearsOfService: newYears
      });
      
      // Add to history
      setEmploymentHistory([...employmentHistory, newEntry]);
      
      // Store in localStorage
      const updatedHistory = [...employmentHistory, newEntry];
      localStorage.setItem('employmentHistory', JSON.stringify(updatedHistory));
      
      // Reset form fields
      setNewSchool("");
      setNewPosition("");
      setNewYears("");
      
      toast({
        title: "History Added",
        description: "Employment history entry has been added."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: "Please fill out all fields correctly.",
          variant: "destructive"
        });
      }
    }
  };

  const removeHistoryItem = (index: number) => {
    const updatedHistory = [...employmentHistory];
    updatedHistory.splice(index, 1);
    setEmploymentHistory(updatedHistory);
    localStorage.setItem('employmentHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "Entry Removed",
      description: "Employment history entry has been removed."
    });
  };

  // Load stored data on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('teacherProfile');
    const storedHistory = localStorage.getItem('employmentHistory');
    
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      // Convert string date back to Date object if it exists
      if (profileData.hiringDate) {
        profileData.hiringDate = new Date(profileData.hiringDate);
      }
      form.reset(profileData);
    }
    
    if (storedHistory) {
      setEmploymentHistory(JSON.parse(storedHistory));
    }
  }, [form]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Job Information</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Manage your teaching credentials, salary steps, and career advancement opportunities.
          </p>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Career Profile</TabsTrigger>
              <TabsTrigger value="history">Employment History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Career Profile</CardTitle>
                  <CardDescription>
                    Enter your teaching credentials and employment details to calculate your salary and benefits.
                    <span className="block mt-2 text-destructive font-medium">* Required fields</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="employeeID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your employee ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="school"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>School</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your school name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Position</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Elementary Teacher, Math Teacher" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="salaryStep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Salary Step</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your step" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1A">1A</SelectItem>
                                  <SelectItem value="1B">1B</SelectItem>
                                  <SelectItem value="2A">2A</SelectItem>
                                  <SelectItem value="2B">2B</SelectItem>
                                  <SelectItem value="3A">3A</SelectItem>
                                  <SelectItem value="3B">3B</SelectItem>
                                  <SelectItem value="4A">4A</SelectItem>
                                  <SelectItem value="4B">4B</SelectItem>
                                  <SelectItem value="5A">5A</SelectItem>
                                  <SelectItem value="5B">5B</SelectItem>
                                  <SelectItem value="6A">6A</SelectItem>
                                  <SelectItem value="6B">6B</SelectItem>
                                  <SelectItem value="7A">7A</SelectItem>
                                  <SelectItem value="7B">7B</SelectItem>
                                  <SelectItem value="8A">8A</SelectItem>
                                  <SelectItem value="8B">8B</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Your salary step according to DOE salary schedule.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="yearsOfService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Years of Service</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select years of service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 31 }, (_, i) => i).map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year} {year === 1 ? 'year' : 'years'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="hiringDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Hire</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "MMMM d, yyyy")
                                    ) : (
                                      <span>Select date of hire</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              This is used to calculate years of service and benefits.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="differential"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Salary Differential</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select differential" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="BA_C1">BA C1</SelectItem>
                                <SelectItem value="C1_PD">C1 +PD</SelectItem>
                                <SelectItem value="BA30_C2">BA+30 or C2</SelectItem>
                                <SelectItem value="C2_ID">C2+ID</SelectItem>
                                <SelectItem value="MA_C2_PD">MA or C2 + PD</SelectItem>
                                <SelectItem value="C2_ID_PD">C2 + ID + PD</SelectItem>
                                <SelectItem value="C6">C6</SelectItem>
                                <SelectItem value="MA30_C6_PD">MA + 30 or C6 + PD</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Salary differentials affect your pay scale based on education and credentials.{" "}
                              <a 
                                href="https://www.uft.org/your-rights/salary/salary-differentials" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary inline-flex items-center hover:underline"
                              >
                                Learn more about salary differentials
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Certifications</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any professional certifications (e.g., Special Education, ESL)"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Certain certifications may qualify for additional pay.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tenured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">
                                I have tenure
                              </FormLabel>
                              <FormDescription>
                                Tenure status impacts job security and certain benefits.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any additional information about your position"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="w-full md:w-auto"
                        >
                          {isSaved ? "Saved!" : "Save Information"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobInfo;
