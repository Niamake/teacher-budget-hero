
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout';
import Footer from '@/components/Footer';
import { BadgeDollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import BudgetForm from '@/components/salary/BudgetForm';
import BudgetCard from '@/components/salary/BudgetCard';
import EntryForm from '@/components/salary/EntryForm';
import EntryList from '@/components/salary/EntryList';
import EarningsChart from '@/components/salary/EarningsChart';
import { PerSessionBudget, PerSessionEntry } from '@/types/perSession';

const PerSessionHours = () => {
  const [budgets, setBudgets] = useState<PerSessionBudget[]>([]);
  const [entries, setEntries] = useState<PerSessionEntry[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load budgets from localStorage
    const storedBudgets = localStorage.getItem('perSessionBudgets');
    if (storedBudgets) {
      try {
        setBudgets(JSON.parse(storedBudgets));
      } catch (error) {
        console.error('Failed to parse per session budgets:', error);
      }
    }
    
    // Load entries from localStorage
    const storedEntries = localStorage.getItem('perSessionEntries');
    if (storedEntries) {
      try {
        setEntries(JSON.parse(storedEntries));
      } catch (error) {
        console.error('Failed to parse per session entries:', error);
      }
    }
  }, []);
  
  // Save budgets to localStorage when they change
  useEffect(() => {
    localStorage.setItem('perSessionBudgets', JSON.stringify(budgets));
  }, [budgets]);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('perSessionEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddBudget = (budget: PerSessionBudget) => {
    setBudgets([...budgets, budget]);
  };
  
  const handleDeleteBudget = (id: string) => {
    // Check if there are entries for this budget
    const hasEntries = entries.some(entry => entry.budgetId === id);
    
    if (hasEntries) {
      const confirmDelete = window.confirm(
        "This budget has hours logged against it. Deleting it will remove all associated entries. Do you want to continue?"
      );
      
      if (!confirmDelete) {
        return;
      }
      
      // Remove associated entries as well
      const filteredEntries = entries.filter(entry => entry.budgetId !== id);
      setEntries(filteredEntries);
    }
    
    const filteredBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(filteredBudgets);
    toast.success('Budget removed successfully');
  };
  
  const handleAddEntry = (entry: PerSessionEntry) => {
    setEntries([...entries, entry]);
  };
  
  const handleDeleteEntry = (id: string) => {
    const filteredEntries = entries.filter(entry => entry.id !== id);
    setEntries(filteredEntries);
    toast.success('Entry removed successfully');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl animate-fade-up">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Per Session Hours</h1>
            </div>
            
            <Button asChild variant="outline">
              <Link to="/salary">
                <Clock className="h-4 w-4 mr-2" />
                Back to Salary Management
              </Link>
            </Button>
          </div>
          
          <p className="text-lg text-foreground/80 mb-8 max-w-3xl">
            Track your per session hours, set budgets, and visualize your earnings. Keep track of your work to ensure you're being paid for all your time.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <BudgetForm onAddBudget={handleAddBudget} />
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {budgets.length > 0 ? (
                  budgets.map((budget) => (
                    <BudgetCard 
                      key={budget.id} 
                      budget={budget} 
                      entries={entries}
                      onDelete={handleDeleteBudget}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-muted/50 border border-border/50 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No Budgets Created Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating a per session budget for an activity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {budgets.length > 0 && (
              <>
                <div className="lg:col-span-1">
                  <EntryForm 
                    budgets={budgets} 
                    onAddEntry={handleAddEntry} 
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <EntryList 
                    entries={entries} 
                    budgets={budgets}
                    onDeleteEntry={handleDeleteEntry}
                  />
                </div>
              </>
            )}
          </div>
          
          {entries.length > 0 && (
            <EarningsChart entries={entries} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PerSessionHours;
