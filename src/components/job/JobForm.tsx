
import { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Badge, BriefcaseIcon, Shield } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

export const formSchema = z.object({
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
  pensionTier: z.enum(["4", "5", "6"], {
    required_error: "Please select your pension tier.",
  }),
  completedMandatory: z.boolean().default(false),
});

export type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  onSaved: () => void;
}

const JobForm = ({ onSaved }: JobFormProps) => {
  const form = useForm<JobFormValues>({
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
      pensionTier: "6",
      completedMandatory: false,
    },
  });

  function onSubmit(values: JobFormValues) {
    console.log(values);
    localStorage.setItem('teacherProfile', JSON.stringify(values));
    
    // Also save pension tier data to qppData in localStorage
    const existingQppData = localStorage.getItem('qppData');
    const parsedQppData = existingQppData ? JSON.parse(existingQppData) : {};
    const qppData = {
      ...parsedQppData,
      pensionTier: values.pensionTier,
      completedMandatory: values.completedMandatory
    };
    localStorage.setItem('qppData', JSON.stringify(qppData));
    
    toast("Profile Saved", {
      description: "Your career profile has been saved successfully."
    });
    
    onSaved();
  }

  useEffect(() => {
    const storedProfile = localStorage.getItem('teacherProfile');
    
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      if (profileData.hiringDate) {
        profileData.hiringDate = new Date(profileData.hiringDate);
      }
      form.reset(profileData);
    }
  }, [form]);

  return (
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Years of Service at DOE</FormLabel>
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
                    <FormDescription>
                      Years working at NYC DOE specifically. This determines longevity pay increases.
                    </FormDescription>
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
                      <SelectItem value="C1_PD">C1+PD</SelectItem>
                      <SelectItem value="BA30_C2">BA+30 or C2</SelectItem>
                      <SelectItem value="C2_ID">C2+ID</SelectItem>
                      <SelectItem value="MA_C2_PD">MA or C2+PD</SelectItem>
                      <SelectItem value="C2_ID_PD">C2+ID+PD</SelectItem>
                      <SelectItem value="C6">C6</SelectItem>
                      <SelectItem value="MA30_C6_PD">MA+30 or C6+PD</SelectItem>
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

            <Card className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Pension Information</CardTitle>
                </div>
                <CardDescription>
                  This information is used to calculate your automatic QPP (pension) contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="pensionTier"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-destructive">Which pension tier are you in?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Tier IV (joined TRS before January 1, 2010)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="5" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Tier V (joined TRS between January 1, 2010 and March 31, 2012)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="6" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Tier VI (joined TRS on or after April 1, 2012)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Your pension tier is determined by when you joined the Teachers' Retirement System
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {form.watch("pensionTier") === "4" && (
                  <FormField
                    control={form.control}
                    name="completedMandatory"
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
                            I have completed my mandatory 3% contributions for 10 years
                          </FormLabel>
                          <FormDescription>
                            Tier IV members must contribute 3% of their salary until they complete 10 years of service
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

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
                Save Information
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
