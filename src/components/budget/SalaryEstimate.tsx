
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Calculator, ExternalLink, InfoIcon } from 'lucide-react';
import SalaryTable from './SalaryTable';

// Define salary ranges based on step and differential
// Source: UFT salary schedule (https://www.uft.org/your-rights/salary/doe-and-city-salary-schedules/teacher-salary-schedule)
// Updated to correct values
export const salaryData = {
  // 1) BA C1 (Column 1)
  BA_C1: {
    "1A": 66733, "1B": 66733, 
    "2A": 68060, "2B": 68060,
    "3A": 68622, "3B": 68622,
    "4A": 69616, "4B": 69616,
    "5A": 70475, "5B": 70475,
    "6A": 71399, "6B": 72710,
    "7A": 74655, "7B": 79212,
    "8A": 83473, "8B": 88536
  },
  // 2) C1 + PD (Column 2)
  C1_PD: {
    "1A": 72777, "1B": 72777, 
    "2A": 74104, "2B": 74104,
    "3A": 74666, "3B": 74666,
    "4A": 75660, "4B": 75660,
    "5A": 76519, "5B": 76519,
    "6A": 77443, "6B": 78754,
    "7A": 80699, "7B": 85256,
    "8A": 89517, "8B": 94580
  },
  // 3) BA + 30 or C2 (Column 3)
  BA30_C2: {
    "1A": 68973, "1B": 68973, 
    "2A": 70300, "2B": 70300,
    "3A": 70862, "3B": 70862,
    "4A": 71856, "4B": 71856,
    "5A": 72715, "5B": 72715,
    "6A": 73639, "6B": 74950,
    "7A": 76895, "7B": 81452,
    "8A": 85713, "8B": 90776
  },
  // 4) C2 + ID (Column 4)
  C2_ID: {
    "1A": 73113, "1B": 73113, 
    "2A": 74440, "2B": 74440,
    "3A": 75002, "3B": 75002,
    "4A": 75996, "4B": 75996,
    "5A": 76855, "5B": 76855,
    "6A": 77779, "6B": 79090,
    "7A": 81035, "7B": 85592,
    "8A": 89853, "8B": 94916
  },
  // 5) MA or C2 + PD (Column 5)
  MA_C2_PD: {
    "1A": 75017, "1B": 75017, 
    "2A": 76344, "2B": 76344,
    "3A": 76906, "3B": 76906,
    "4A": 77900, "4B": 77900,
    "5A": 78759, "5B": 78759,
    "6A": 79683, "6B": 80994,
    "7A": 82939, "7B": 87496,
    "8A": 91757, "8B": 96820
  },
  // 6) C2 + ID + PD (Column 6)
  C2_ID_PD: {
    "1A": 79154, "1B": 79154, 
    "2A": 80481, "2B": 80481,
    "3A": 81043, "3B": 81043,
    "4A": 82037, "4B": 82037,
    "5A": 82896, "5B": 82896,
    "6A": 83820, "6B": 85131,
    "7A": 87076, "7B": 91633,
    "8A": 95894, "8B": 100957
  },
  // 7) C6 (Column 7)
  C6: {
    "1A": 77260, "1B": 77260, 
    "2A": 78587, "2B": 78587,
    "3A": 79149, "3B": 79149,
    "4A": 80143, "4B": 80143,
    "5A": 81002, "5B": 81002,
    "6A": 81926, "6B": 83237,
    "7A": 85182, "7B": 89739,
    "8A": 94000, "8B": 99063
  },
  // 8) MA + 30 or C6 + PD (Column 8)
  MA30_C6_PD: {
    "1A": 83300, "1B": 83300, 
    "2A": 84627, "2B": 84627,
    "3A": 85189, "3B": 85189,
    "4A": 86183, "4B": 86183,
    "5A": 87042, "5B": 87042,
    "6A": 87966, "6B": 89277,
    "7A": 91222, "7B": 95779,
    "8A": 100040, "8B": 105103
  }
};

// Helper function to get the differential name for display
export const getDifferentialName = (differentialCode: string): string => {
  switch (differentialCode) {
    case "BA_C1": return "BA C1";
    case "C1_PD": return "C1 +PD";
    case "BA30_C2": return "BA+30 or C2";
    case "C2_ID": return "C2+ID";
    case "MA_C2_PD": return "MA or C2 + PD";
    case "C2_ID_PD": return "C2 + ID + PD";
    case "C6": return "C6";
    case "MA30_C6_PD": return "MA + 30 or C6 + PD";
    default: return differentialCode;
  }
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface SalaryEstimateProps {
  teacherProfile: any | null;
}

const SalaryEstimate = ({ teacherProfile }: SalaryEstimateProps) => {
  const navigate = useNavigate();
  const [estimatedSalary, setEstimatedSalary] = useState<number | null>(null);
  const [showSalaryTable, setShowSalaryTable] = useState<boolean>(false);

  // Calculate salary based on profile
  useState(() => {
    if (teacherProfile?.salaryStep && teacherProfile?.differential) {
      const differential = teacherProfile.differential;
      const step = teacherProfile.salaryStep;
      
      if (salaryData[differential] && salaryData[differential][step]) {
        setEstimatedSalary(salaryData[differential][step]);
      }
    }
  });

  // Calculate monthly salary
  const monthlyEstimate = estimatedSalary ? Math.round(estimatedSalary / 12) : null;

  // Calculate bi-weekly salary (26 pay periods)
  const biWeeklyEstimate = estimatedSalary ? Math.round(estimatedSalary / 26) : null;

  // Toggle salary table visibility
  const toggleSalaryTable = () => {
    setShowSalaryTable(!showSalaryTable);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Estimated Salary</CardTitle>
        <CardDescription>
          Based on your job profile, tenure, and the current UFT salary schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {estimatedSalary ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Annual (Gross)</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(estimatedSalary)}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Monthly (Gross)</p>
                <p className="text-2xl md:text-3xl font-bold">{formatCurrency(monthlyEstimate || 0)}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Bi-Weekly (Gross)</p>
                <p className="text-2xl md:text-3xl font-bold">{formatCurrency(biWeeklyEstimate || 0)}</p>
              </div>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Salary Details</AlertTitle>
              <AlertDescription>
                <p className="mb-2">This estimate is based on the following information from your profile:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Salary Step: <span className="font-medium">{teacherProfile.salaryStep}</span></li>
                  <li>
                    Salary Differential: <span className="font-medium">
                      {getDifferentialName(teacherProfile.differential)}
                    </span>
                  </li>
                  <li>Years of Service: <span className="font-medium">{teacherProfile.yearsOfService}</span></li>
                </ul>
                <div className="mt-3 flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleSalaryTable} 
                    className="mr-3"
                  >
                    {showSalaryTable ? "Hide Salary Table" : "View Salary Table"}
                  </Button>
                  <a 
                    href="https://www.uft.org/your-rights/salary/doe-and-city-salary-schedules/teacher-salary-schedule" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center hover:underline text-sm"
                  >
                    View the full UFT salary schedule
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </AlertDescription>
            </Alert>

            {showSalaryTable && <SalaryTable teacherProfile={teacherProfile} />}
            
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> These are gross salary estimates. Your net pay will be lower after taxes, 
                benefits deductions, retirement contributions, and other withholdings.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Calculator className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              We couldn't calculate your salary. Please ensure your salary step and differential 
              are set correctly in your profile.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/job-info')}
            >
              Update Job Information
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryEstimate;
