
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BadgeDollarSign } from 'lucide-react';
import SalaryEstimate from '@/components/budget/SalaryEstimate';
import BudgetTools from '@/components/budget/BudgetTools';
import ProfileNeeded from '@/components/budget/ProfileNeeded';

const Budget = () => {
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load teacher profile from localStorage
    const storedProfile = localStorage.getItem('teacherProfile');
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setTeacherProfile(profileData);
    }
  }, []);

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
            <ProfileNeeded />
          ) : (
            <>
              <SalaryEstimate teacherProfile={teacherProfile} />
              <BudgetTools />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Budget;
