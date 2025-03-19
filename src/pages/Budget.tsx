
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, Calculator, Link as LinkIcon, ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Define salary ranges based on step and differential
// Source: UFT salary schedule (https://www.uft.org/your-rights/salary/doe-and-city-salary-schedules/teacher-salary-schedule)
const salaryData = {
  // BA (C1)
  BA_C1: {
    "1A": 61491, "1B": 61491, 
    "2A": 62301, "2B": 65104,
    "3A": 65104, "3B": 65104,
    "4A": 65104, "4B": 65948,
    "5A": 66792, "5B": 67636,
    "6A": 68480, "6B": 69324,
    "7A": 73643, "7B": 79749,
    "8A": 87748, "8B": 94915
  },
  // C1 + PD
  C1_PD: {
    "1A": 68510, "1B": 68510, 
    "2A": 69320, "2B": 72123,
    "3A": 72123, "3B": 72123,
    "4A": 72123, "4B": 72967,
    "5A": 73811, "5B": 74655,
    "6A": 75499, "6B": 76343,
    "7A": 80662, "7B": 86768,
    "8A": 94767, "8B": 101934
  },
  // BA + 30 (C2)
  BA30_C2: {
    "1A": 65548, "1B": 65548, 
    "2A": 66358, "2B": 69161,
    "3A": 69161, "3B": 69161,
    "4A": 69161, "4B": 70005,
    "5A": 70849, "5B": 71693,
    "6A": 72537, "6B": 73381,
    "7A": 77700, "7B": 83806,
    "8A": 91805, "8B": 98972
  },
  // C2 + ID
  C2_ID: {
    "1A": 66824, "1B": 66824, 
    "2A": 67634, "2B": 70437,
    "3A": 70437, "3B": 70437,
    "4A": 70437, "4B": 71281,
    "5A": 72125, "5B": 72969,
    "6A": 73813, "6B": 74657,
    "7A": 78976, "7B": 85082,
    "8A": 93081, "8B": 100248
  },
  // MA (C2 + PD)
  MA_C2_PD: {
    "1A": 72567, "1B": 72567, 
    "2A": 73377, "2B": 76180,
    "3A": 76180, "3B": 76180,
    "4A": 76180, "4B": 77024,
    "5A": 77868, "5B": 78712,
    "6A": 79556, "6B": 80400,
    "7A": 84719, "7B": 90825,
    "8A": 98824, "8B": 105991
  },
  // C2 + ID + PD
  C2_ID_PD: {
    "1A": 73843, "1B": 73843, 
    "2A": 74653, "2B": 77456,
    "3A": 77456, "3B": 77456,
    "4A": 77456, "4B": 78300,
    "5A": 79144, "5B": 79988,
    "6A": 80832, "6B": 81676,
    "7A": 85995, "7B": 92101,
    "8A": 100100, "8B": 107267
  },
  // C6
  C6: {
    "1A": 72869, "1B": 72869, 
    "2A": 73679, "2B": 76482,
    "3A": 76482, "3B": 76482,
    "4A": 76482, "4B": 77326,
    "5A": 78169, "5B": 79014,
    "6A": 79858, "6B": 80702,
    "7A": 85021, "7B": 91127,
    "8A": 99126, "8B": 106293
  },
  // MA + 30 (C6 + PD)
  MA30_C6_PD: {
    "1A": 79888, "1B": 79888, 
    "2A": 80698, "2B": 83501,
    "3A": 83501, "3B": 83501,
    "4A": 83501, "4B": 84345,
    "5A": 85188, "5B": 86033,
    "6A": 86877, "6B": 87721,
    "7A": 92040, "7B": 98146,
    "8A": 106145, "8B": 113312
  }
};

const Budget = () => {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [estimatedSalary, setEstimatedSalary] = useState<number | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load teacher profile from localStorage
    const storedProfile = localStorage.getItem('teacherProfile');
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setTeacherProfile(profileData);
      
      // Calculate salary based on step and differential
      if (profileData.salaryStep && profileData.differential) {
        const differential = profileData.differential;
        const step = profileData.salaryStep;
        
        if (salaryData[differential] && salaryData[differential][step]) {
          setEstimatedSalary(salaryData[differential][step]);
        }
      }
    }
  }, []);

  // Calculate monthly salary
  const monthlyEstimate = estimatedSalary ? Math.round(estimatedSalary / 12) : null;

  // Calculate bi-weekly salary (26 pay periods)
  const biWeeklyEstimate = estimatedSalary ? Math.round(estimatedSalary / 26) : null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <BadgeDollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Budget Management</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Track your income and expenses with tools designed specifically for NYC teachers.
          </p>
          
          {!teacherProfile ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  We need some information to calculate your estimated salary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-6">
                  Please complete your job information profile to see your estimated salary and budget tools.
                </p>
                <Button onClick={() => navigate('/job-info')} className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Go to Job Information
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
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
                                {teacherProfile.differential === "BA_C1" ? "BA C1" : 
                                 teacherProfile.differential === "C1_PD" ? "C1 +PD" : 
                                 teacherProfile.differential === "BA30_C2" ? "BA+30 or C2" :
                                 teacherProfile.differential === "C2_ID" ? "C2+ID" :
                                 teacherProfile.differential === "MA_C2_PD" ? "MA or C2 + PD" :
                                 teacherProfile.differential === "C2_ID_PD" ? "C2 + ID + PD" :
                                 teacherProfile.differential === "C6" ? "C6" :
                                 teacherProfile.differential === "MA30_C6_PD" ? "MA + 30 or C6 + PD" :
                                 teacherProfile.differential}
                              </span>
                            </li>
                            <li>Years of Service: <span className="font-medium">{teacherProfile.yearsOfService}</span></li>
                          </ul>
                          <p className="mt-3 text-sm">
                            <a 
                              href="https://www.uft.org/your-rights/salary/doe-and-city-salary-schedules/teacher-salary-schedule" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary inline-flex items-center hover:underline"
                            >
                              View the full UFT salary schedule
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </p>
                        </AlertDescription>
                      </Alert>
                      
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Budget Tools</CardTitle>
                  <CardDescription>
                    Track your income and expenses to manage your finances effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-lg text-foreground/60">
                    Budget management tools coming soon...
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Budget;
