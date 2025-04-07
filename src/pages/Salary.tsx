
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout';
import Footer from '@/components/Footer';
import { BadgeDollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SalaryEstimate from '@/components/budget/SalaryEstimate';
import BudgetTools from '@/components/budget/BudgetTools';
import ProfileNeeded from '@/components/budget/ProfileNeeded';
import { formatCurrency, getCurrentPerSessionRate } from '@/utils/taxCalculations';
import { Link } from 'react-router-dom';

const Salary = () => {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [extraIncome, setExtraIncome] = useState<string>("");
  const [perSessionHours, setPerSessionHours] = useState<string>("");
  const [bonusPay, setBonusPay] = useState<string>("");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load teacher profile from localStorage
    const storedProfile = localStorage.getItem('teacherProfile');
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setTeacherProfile(profileData);
    }
    
    // Load budget data from localStorage
    const storedBudgetData = localStorage.getItem('budgetData');
    if (storedBudgetData) {
      try {
        const parsedData = JSON.parse(storedBudgetData);
        setExtraIncome(parsedData.extraIncome || "");
        setPerSessionHours(parsedData.perSessionHours || "");
        setBonusPay(parsedData.bonusPay || "");
      } catch (error) {
        console.error("Failed to parse budget data:", error);
      }
    }
  }, []);

  // Handle salary estimate updates
  const handleSalaryEstimated = (salary: number) => {
    if (teacherProfile && salary) {
      // Update teacher profile with estimated salary
      const updatedProfile = {
        ...teacherProfile,
        estimatedSalary: salary
      };
      
      // Save updated profile to localStorage
      localStorage.setItem('teacherProfile', JSON.stringify(updatedProfile));
      setTeacherProfile(updatedProfile);
    }
  };
  
  const handleExtraIncomeChange = (value: string) => {
    setExtraIncome(value);
    updateBudgetData({ extraIncome: value });
  };
  
  const handlePerSessionHoursChange = (value: string) => {
    setPerSessionHours(value);
    updateBudgetData({ perSessionHours: value });
  };
  
  const handleBonusPayChange = (value: string) => {
    setBonusPay(value);
    updateBudgetData({ bonusPay: value });
  };
  
  const updateBudgetData = (newValues: Record<string, string>) => {
    const budgetData = JSON.parse(localStorage.getItem('budgetData') || '{}');
    const updatedData = { ...budgetData, ...newValues };
    localStorage.setItem('budgetData', JSON.stringify(updatedData));
  };
  
  const perSessionRate = getCurrentPerSessionRate();
  const perSessionIncome = Number(perSessionHours || 0) * perSessionRate;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <BadgeDollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Salary Management</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Manage your salary information and track your income as an NYC teacher.
          </p>
          
          {!teacherProfile ? (
            <ProfileNeeded />
          ) : (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-6 w-6 text-primary" />
                    <CardTitle>Additional Income</CardTitle>
                  </div>
                  <CardDescription>
                    Record any income you earn outside of your regular teaching salary
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="extra-income">Additional Annual Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="extra-income"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={extraIncome}
                          onChange={(e) => handleExtraIncomeChange(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Income not from your teaching position</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bonus-pay">School Bonus Pay</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="bonus-pay"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={bonusPay}
                          onChange={(e) => handleBonusPayChange(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">6th period, stimulus, crowdfunding, etc.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="per-session-hours">Per Session Hours</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                          <Input
                            id="per-session-hours"
                            type="number"
                            placeholder="0"
                            value={perSessionHours}
                            onChange={(e) => handlePerSessionHoursChange(e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          className="whitespace-nowrap"
                        >
                          <Link to="/per-session-hours">
                            <Clock className="mr-2 h-4 w-4" />
                            Track Hours
                          </Link>
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-xs text-muted-foreground">Current rate: ${perSessionRate.toFixed(2)}/hour</p>
                        {perSessionIncome > 0 && (
                          <p className="text-xs font-medium">Estimated income: {formatCurrency(perSessionIncome)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Per Session Hours Tracking
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Track your per session hours in detail, set budgets, and visualize your earnings over time.
                    </p>
                    <Button asChild>
                      <Link to="/per-session-hours">
                        Go to Per Session Hours Tracker
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <BudgetTools />
              <SalaryEstimate 
                teacherProfile={teacherProfile} 
                onSalaryEstimated={handleSalaryEstimated}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Salary;
