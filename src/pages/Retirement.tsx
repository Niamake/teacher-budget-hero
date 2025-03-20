
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QPPSection from '@/components/retirement/QPPSection';
import TDASection from '@/components/retirement/TDASection';
import DeferredCompSection from '@/components/retirement/DeferredCompSection';
import RothIRASection from '@/components/retirement/RothIRASection';
import { toast } from "sonner";

// Define types for our retirement data
export interface RetirementAccountData {
  tdaData?: {
    currentBalance: string;
    annualContribution: string;
  };
  deferredCompData?: {
    currentBalance: string;
    annualContribution: string;
    returnRate: number;
  };
  rothIraData?: {
    currentBalance: string;
    annualContribution: string;
    returnRate: number;
  };
}

const Retirement = () => {
  const [activeTab, setActiveTab] = useState("qpp");
  const [retirementData, setRetirementData] = useState<RetirementAccountData>({});
  
  // Load saved data from localStorage on initial render
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const savedData = localStorage.getItem('retirementData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setRetirementData(parsedData);
        toast.success("Loaded your saved retirement data");
      } catch (error) {
        console.error("Failed to parse saved retirement data:", error);
      }
    }
  }, []);

  // Save updated data to localStorage
  const saveRetirementData = (data: RetirementAccountData) => {
    const updatedData = { ...retirementData, ...data };
    setRetirementData(updatedData);
    localStorage.setItem('retirementData', JSON.stringify(updatedData));
    toast.success("Saved your retirement data");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Retirement Planning</h1>
          <p className="text-lg text-foreground/80 mb-8">
            Track your retirement accounts, monitor contributions, and plan for your financial future as a DOE employee.
          </p>
          
          <Tabs defaultValue="qpp" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="qpp">QPP</TabsTrigger>
              <TabsTrigger value="tda">TDA</TabsTrigger>
              <TabsTrigger value="457b">457(b)</TabsTrigger>
              <TabsTrigger value="roth">Roth IRA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="qpp" className="mt-6">
              <QPPSection />
            </TabsContent>
            
            <TabsContent value="tda" className="mt-6">
              <TDASection 
                savedData={retirementData.tdaData}
                onSave={(data) => saveRetirementData({ tdaData: data })}
              />
            </TabsContent>
            
            <TabsContent value="457b" className="mt-6">
              <DeferredCompSection 
                savedData={retirementData.deferredCompData}
                onSave={(data) => saveRetirementData({ deferredCompData: data })}
              />
            </TabsContent>
            
            <TabsContent value="roth" className="mt-6">
              <RothIRASection 
                savedData={retirementData.rothIraData}
                onSave={(data) => saveRetirementData({ rothIraData: data })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Retirement;
