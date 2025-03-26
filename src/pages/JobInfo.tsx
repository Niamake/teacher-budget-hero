
import { useEffect, useState } from 'react';
import { BriefcaseIcon } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobForm from '@/components/job/JobForm';
import EmploymentHistory from '@/components/job/EmploymentHistory';

const JobInfo = () => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSaved = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
              <JobForm onSaved={handleSaved} />
            </TabsContent>
            <TabsContent value="history">
              <EmploymentHistory />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobInfo;
