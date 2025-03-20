
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QPPSection from '@/components/retirement/QPPSection';
import TDASection from '@/components/retirement/TDASection';
import DeferredCompSection from '@/components/retirement/DeferredCompSection';
import RothIRASection from '@/components/retirement/RothIRASection';

const Retirement = () => {
  const [activeTab, setActiveTab] = useState("qpp");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <TDASection />
            </TabsContent>
            
            <TabsContent value="457b" className="mt-6">
              <DeferredCompSection />
            </TabsContent>
            
            <TabsContent value="roth" className="mt-6">
              <RothIRASection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Retirement;
