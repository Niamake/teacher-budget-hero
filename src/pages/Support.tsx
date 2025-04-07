
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoyIcon, MessageSquareIcon } from 'lucide-react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('help');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "How do I calculate my salary as an NYC teacher?",
      answer: "Use our Salary tool to calculate your salary based on your education level and years of experience. The tool uses the latest NYC DOE salary schedules."
    },
    {
      question: "How do I create a budget?",
      answer: "Navigate to the Budget Management section where you can create and manage your budget. Enter your income, expenses, and track your spending over time."
    },
    {
      question: "What retirement options are available to NYC teachers?",
      answer: "NYC teachers have access to the QPP (Qualified Pension Plan), TDA (Tax-Deferred Annuity), 457(b) plan, and can also contribute to personal retirement accounts like Roth IRAs. Visit our Retirement Planning section for detailed information."
    },
    {
      question: "How do I estimate my taxes?",
      answer: "Use our Tax Estimation tool to get an estimate of your federal, state, and city taxes. The tool accounts for the specific tax situations of NYC teachers."
    },
    {
      question: "What information do I need to track my career progression?",
      answer: "Track your certification status, education credits, and years of service in the Job Information section. This helps you understand your salary step and potential for advancement."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Support Center</h1>
          <p className="text-lg text-foreground/80 mb-8">
            Get help with using TeacherFinance. Find answers to common questions or contact us directly.
          </p>
          
          <Tabs defaultValue="help" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="help" className="flex items-center gap-2">
                <LifeBuoyIcon className="h-4 w-4" />
                <span>Help Center</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                <span>Contact Us</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="help" className="mt-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
                <p className="mb-4">
                  Our support team is here to help you with any questions or issues you might have.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Email Support</h3>
                    <p className="text-sm text-foreground/70">
                      Send us an email at <span className="text-primary">support@teacherfinance.com</span>
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Response Time</h3>
                    <p className="text-sm text-foreground/70">
                      We aim to respond to all inquiries within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
