
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SalaryInformationFormValues {
  salaryStep: string;
  differential: string;
  yearsOfService: string;
}

const SalaryInformationForm = () => {
  const form = useForm<SalaryInformationFormValues>({
    defaultValues: {
      salaryStep: "1A",
      differential: "BA_C1",
      yearsOfService: "0",
    }
  });

  useEffect(() => {
    // Load data if available
    const profileData = localStorage.getItem('teacherProfile');
    if (profileData) {
      try {
        const parsedData = JSON.parse(profileData);
        form.setValue("salaryStep", parsedData.salaryStep || "1A");
        form.setValue("differential", parsedData.differential || "BA_C1");
        form.setValue("yearsOfService", parsedData.yearsOfService || "0");
      } catch (error) {
        console.error("Failed to parse teacher profile data:", error);
      }
    }
  }, []);

  const onSubmit = (data: SalaryInformationFormValues) => {
    // Get existing profile data if any
    const existingProfile = localStorage.getItem('teacherProfile');
    const profileData = existingProfile ? JSON.parse(existingProfile) : {};
    
    // Update with new values
    const updatedProfile = {
      ...profileData,
      salaryStep: data.salaryStep,
      differential: data.differential,
      yearsOfService: data.yearsOfService
    };
    
    localStorage.setItem('teacherProfile', JSON.stringify(updatedProfile));
    toast.success("Saved your salary information");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="salaryStep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary Step</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your salary step" />
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
                Your salary step based on years of teaching experience and education.
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
              <FormLabel>Education Differential</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education differential" />
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
                Your differential based on your education and professional development.
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
              <FormLabel>Years of DOE Service</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max="50" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Total number of years you've worked at the DOE. This affects longevity pay.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Salary Information</Button>
      </form>
    </Form>
  );
};

export default SalaryInformationForm;
