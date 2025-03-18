
import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, BadgeDollarSign, BriefcaseIcon, Calculator, FileText, InfoIcon } from 'lucide-react';
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

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  employeeID: z.string().min(4, {
    message: "Employee ID must be at least 4 characters.",
  }),
  school: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  salaryStep: z.string(),
  yearsOfService: z.string(),
  hiringDate: z.date({
    required_error: "Date of hire is required.",
  }),
  differential: z.string(),
  certifications: z.string().optional(),
  tenured: z.boolean().default(false),
  additionalNotes: z.string().optional(),
});

const JobInfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSaved, setIsSaved] = useState(false);

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
    // In a real app, this would save to a backend or localStorage
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

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
                              <FormLabel>First Name</FormLabel>
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
                              <FormLabel>Last Name</FormLabel>
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
                              <FormLabel>Position</FormLabel>
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
                              <FormLabel>Salary Step</FormLabel>
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
                              <FormLabel>Years of Service</FormLabel>
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
                            <FormLabel>Salary Differential</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select differential" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="BA">BA (Base)</SelectItem>
                                <SelectItem value="BA+30">BA+30</SelectItem>
                                <SelectItem value="MA">MA</SelectItem>
                                <SelectItem value="MA+30">MA+30</SelectItem>
                                <SelectItem value="ED_D_PHD">Earned Doctorate, PhD</SelectItem>
                                <SelectItem value="COLLEGE_CREDITS">College Credits</SelectItem>
                                <SelectItem value="PROMOTIONAL_DIFF">Promotional Differential</SelectItem>
                                <SelectItem value="NBPTS">National Board for Professional Teaching Standards</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Salary differentials affect your pay scale based on education and credentials.
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
                            <FormLabel>Certifications</FormLabel>
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
                              <FormLabel>
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
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2" />
                      <p className="text-lg text-muted-foreground">
                        Employment history section coming soon...
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <InfoIcon className="h-4 w-4" />
                      <p>This section will allow you to track your career progression.</p>
                    </div>
                  </div>
                </CardFooter>
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
