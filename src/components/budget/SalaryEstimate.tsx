import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Calculator, ExternalLink, InfoIcon, CalendarIcon } from 'lucide-react';
import SalaryTable from './SalaryTable';
import { 
  getCurrentSalarySchedule, 
  getNextSalarySchedule,
  getDifferentialName, 
  formatCurrency, 
  calculateSalaryWithLongevity 
} from '../../data/salarySchedules';

interface SalaryEstimateProps {
  teacherProfile: any | null;
}

const SalaryEstimate = ({ teacherProfile }: SalaryEstimateProps) => {
  const navigate = useNavigate();
  const [estimatedSalary, setEstimatedSalary] = useState<number | null>(null);
  const [showSalaryTable, setShowSalaryTable] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState(getCurrentSalarySchedule());
  const [nextSchedule, setNextSchedule] = useState(getNextSalarySchedule());
  const [yearsAtDOE, setYearsAtDOE] = useState<number>(0);
  
  useEffect(() => {
    if (teacherProfile?.salaryStep && teacherProfile?.differential) {
      const differential = teacherProfile.differential;
      const step = teacherProfile.salaryStep;
      const yearsService = parseInt(teacherProfile.yearsOfService || '0');
      
      setYearsAtDOE(yearsService);
      
      const salary = calculateSalaryWithLongevity(step, differential, yearsService);
      setEstimatedSalary(salary);
    }
  }, [teacherProfile]);

  const getPercentIncrease = (description: string) => {
    const match = description.match(/\((\d+(?:\.\d+)?)%\s+increase\)/);
    return match ? match[1] + "%" : "";
  };

  const monthlyEstimate = estimatedSalary ? Math.round(estimatedSalary / 12) : null;
  const semiMonthlyEstimate = estimatedSalary ? Math.round(estimatedSalary / 24) : null;

  const toggleSalaryTable = () => {
    setShowSalaryTable(!showSalaryTable);
  };

  const formatEffectiveDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCalendarDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Estimated Salary</CardTitle>
        <CardDescription>
          Based on your job profile, tenure, and the current UFT salary schedule (effective {currentSchedule.description}).
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
                <p className="text-sm font-medium text-muted-foreground mb-2">Semi-Monthly (Gross)</p>
                <p className="text-2xl md:text-3xl font-bold">{formatCurrency(semiMonthlyEstimate || 0)}</p>
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
                  <li>Years of Service at DOE: <span className="font-medium">{teacherProfile.yearsOfService}</span></li>
                  {yearsAtDOE >= 5 && (
                    <li className="text-primary">
                      <span className="font-medium">Longevity Pay: </span> 
                      You qualify for longevity pay based on {yearsAtDOE} years at DOE
                    </li>
                  )}
                </ul>
                
                {nextSchedule && (
                  <div className="mt-3 p-2 bg-primary/10 rounded-md text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="font-medium">Salary Increase taking effect on {formatEffectiveDate(nextSchedule.effectiveDate)} ({formatCalendarDate(nextSchedule.effectiveDate)}) - {getPercentIncrease(nextSchedule.description)} increase</p>
                    </div>
                  </div>
                )}
                
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

            {showSalaryTable && (
              <SalaryTable 
                teacherProfile={teacherProfile} 
                yearsAtDOE={yearsAtDOE}
              />
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> These are gross salary estimates. Your net pay will be lower after taxes, 
                benefits deductions, retirement contributions, and other withholdings. NYC DOE teachers are paid semi-monthly (24 pay periods per year).
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
