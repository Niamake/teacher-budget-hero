
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Calculator } from "lucide-react";
import { TaxData, TaxResults as TaxResultsType } from '@/types/tax';
import { calculateTaxes } from '@/utils/taxCalculations';
import TaxForm from '@/components/tax/TaxForm';
import TaxResults from '@/components/tax/TaxResults';

const TaxEstimate = () => {
  const [taxData, setTaxData] = useState<TaxData>({
    grossSalary: "",
    qppContribution: "",
    tdaContribution: "",
    deferredCompContribution: "",
    extraIncome: "",
    perSessionHours: ""
  });
  
  const [activeTab, setActiveTab] = useState("federal");
  const [taxResults, setTaxResults] = useState<TaxResultsType>({
    federal: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    state: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    city: { taxableIncome: 0, tax: 0, effectiveRate: 0 },
    fica: { socialSecurity: 0, medicare: 0, total: 0 },
    takeHome: { annual: 0, monthly: 0, biweekly: 0 },
    income: { salary: 0, extraIncome: 0, perSession: 0, total: 0 }
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load salary data from localStorage if available
    const teacherProfile = localStorage.getItem('teacherProfile');
    const retirementData = localStorage.getItem('retirementData');
    const qppData = localStorage.getItem('qppData');
    
    let grossSalary = "";
    let qppContribution = "";
    let tdaContribution = "";
    let deferredCompContribution = "";
    
    if (teacherProfile) {
      try {
        const profileData = JSON.parse(teacherProfile);
        // First try to get the estimated salary from budget page
        if (profileData.estimatedSalary) {
          grossSalary = profileData.estimatedSalary.toString();
        } else if (profileData.salary) {
          // Fall back to the salary from job info
          grossSalary = profileData.salary.toString();
        }
      } catch (error) {
        console.error("Failed to parse teacher profile:", error);
      }
    }
    
    if (qppData && grossSalary) {
      try {
        const parsedQppData = JSON.parse(qppData);
        const contributionRate = parsedQppData.contributionRate || 0;
        qppContribution = (Number(grossSalary) * (contributionRate / 100)).toString();
      } catch (error) {
        console.error("Failed to parse QPP data:", error);
      }
    }
    
    if (retirementData) {
      try {
        const parsedData = JSON.parse(retirementData);
        tdaContribution = parsedData.tdaData?.annualContribution || "";
        deferredCompContribution = parsedData.deferredCompData?.annualContribution || "";
      } catch (error) {
        console.error("Failed to parse retirement data:", error);
      }
    }
    
    // Also check localStorage for additional income data
    const budgetData = localStorage.getItem('budgetData');
    let extraIncome = "";
    let perSessionHours = "";
    
    if (budgetData) {
      try {
        const parsedBudgetData = JSON.parse(budgetData);
        extraIncome = parsedBudgetData.extraIncome || "";
        perSessionHours = parsedBudgetData.perSessionHours || "";
      } catch (error) {
        console.error("Failed to parse budget data:", error);
      }
    }
    
    setTaxData({
      grossSalary,
      qppContribution,
      tdaContribution,
      deferredCompContribution,
      extraIncome,
      perSessionHours
    });
  }, []);
  
  // Automatically calculate taxes whenever tax data changes
  useEffect(() => {
    if (taxData.grossSalary) {
      const results = calculateTaxes(taxData);
      setTaxResults(results);
      
      // Save the calculated take-home pay to localStorage for the budget page
      const budgetData = {
        takeHomeAnnual: results.takeHome.annual,
        takeHomeMonthly: results.takeHome.monthly,
        takeHomeBiweekly: results.takeHome.biweekly,
        extraIncome: taxData.extraIncome || "",
        perSessionHours: taxData.perSessionHours || ""
      };
      localStorage.setItem('budgetData', JSON.stringify(budgetData));
    }
  }, [taxData]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Tax Estimation</h1>
          </div>
          <p className="text-lg text-foreground/80 mb-8">
            Get a clearer picture of your tax obligations with calculators designed for NYC teachers.
          </p>
          
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              <p className="mb-2">We are not tax specialists. The estimates provided are for informational purposes only. 
              For tax advice specific to your situation, please consult with a qualified accountant 
              or tax specialist.</p>
              <p>These calculations assume you are <strong>filing as single with no dependents</strong>, taking the standard deduction.</p>
            </AlertDescription>
          </Alert>
          
          <TaxForm taxData={taxData} setTaxData={setTaxData} />
          
          {taxResults.federal.tax > 0 && (
            <TaxResults 
              taxResults={taxResults} 
              taxData={taxData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaxEstimate;
