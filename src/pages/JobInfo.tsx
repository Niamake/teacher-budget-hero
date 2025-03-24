
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Clock, School, GraduationCap, BookOpen, Shield } from 'lucide-react';
import PensionTierForm from '@/components/job/PensionTierForm';
import SalaryInformationForm from '@/components/job/SalaryInformationForm';

const JobInfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Job Information</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Manage information about your teaching position and employment details.
          </p>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
                <CardDescription>
                  Details that determine your salary according to the UFT salary schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SalaryInformationForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pension Information</CardTitle>
                <CardDescription>
                  Your pension tier and mandatory contribution details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <PensionTierForm />
              </CardContent>
            </Card>
            
            {/* Additional cards or sections as needed */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobInfo;
