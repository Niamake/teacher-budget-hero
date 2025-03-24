
import { useState, useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PensionTierFormValues {
  pensionTier: "4" | "5" | "6";
  completedMandatory: boolean;
}

const PensionTierForm = () => {
  const form = useForm<PensionTierFormValues>({
    defaultValues: {
      pensionTier: "6",
      completedMandatory: false,
    }
  });

  useEffect(() => {
    // Load QPP data if available
    const qppData = localStorage.getItem('qppData');
    if (qppData) {
      try {
        const parsedData = JSON.parse(qppData);
        form.setValue("pensionTier", parsedData.pensionTier || "6");
        form.setValue("completedMandatory", parsedData.completedMandatory || false);
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }
  }, []);

  const onSubmit = (data: PensionTierFormValues) => {
    // Get existing QPP data if any
    const existingQppData = localStorage.getItem('qppData');
    const qppData = existingQppData ? JSON.parse(existingQppData) : {};
    
    // Update with new values
    const updatedQppData = {
      ...qppData,
      pensionTier: data.pensionTier,
      completedMandatory: data.completedMandatory
    };
    
    localStorage.setItem('qppData', JSON.stringify(updatedQppData));
    toast.success("Saved your pension tier information");
  };

  return (
    <div className="flex items-start gap-2">
      <Shield className="h-5 w-5 text-primary mt-1" />
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-2">Pension Information</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pensionTier"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Which pension tier are you in?</FormLabel>
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

            <Button type="submit" className="w-full">
              Save Pension Information
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PensionTierForm;
