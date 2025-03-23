
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/taxCalculations';
import ProfileNeeded from '@/components/budget/ProfileNeeded';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  amount: string;
  type: 'income' | 'expense';
}

interface BudgetData {
  items: BudgetItem[];
  monthly_income: string;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing',
  'Utilities',
  'Food',
  'Transportation',
  'Insurance',
  'Healthcare',
  'Debt Payments',
  'Personal',
  'Entertainment',
  'Education',
  'Savings',
  'Miscellaneous'
];

const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Additional Income',
  'Per Session',
  'Investments',
  'Side Hustle',
  'Other'
];

const Budgeting = () => {
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    items: [],
    monthly_income: ""
  });
  const [newItem, setNewItem] = useState<Omit<BudgetItem, 'id'>>({
    category: DEFAULT_EXPENSE_CATEGORIES[0],
    name: '',
    amount: '',
    type: 'expense'
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load teacher profile from localStorage
    const storedProfile = localStorage.getItem('teacherProfile');
    if (storedProfile) {
      setTeacherProfile(JSON.parse(storedProfile));
    }
    
    // Load budget data
    const storedBudgetData = localStorage.getItem('budgetItemsData');
    if (storedBudgetData) {
      try {
        setBudgetData(JSON.parse(storedBudgetData));
      } catch (error) {
        console.error("Failed to parse budget data:", error);
      }
    }
    
    // Set initial monthly income from tax calculations if available
    const taxBudgetData = localStorage.getItem('budgetData');
    if (taxBudgetData) {
      try {
        const parsedData = JSON.parse(taxBudgetData);
        if (parsedData.takeHomeMonthly && !budgetData.monthly_income) {
          setBudgetData(prev => ({
            ...prev,
            monthly_income: Math.round(parsedData.takeHomeMonthly).toString()
          }));
        }
      } catch (error) {
        console.error("Failed to parse tax budget data:", error);
      }
    }
  }, []);
  
  // Save budget data whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetItemsData', JSON.stringify(budgetData));
  }, [budgetData]);
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount) return;
    
    const newItemWithId: BudgetItem = {
      ...newItem,
      id: Date.now().toString()
    };
    
    setBudgetData({
      ...budgetData,
      items: [...budgetData.items, newItemWithId]
    });
    
    // Reset form
    setNewItem({
      category: newItem.type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES[0] : DEFAULT_INCOME_CATEGORIES[0],
      name: '',
      amount: '',
      type: newItem.type
    });
  };
  
  const handleDeleteItem = (id: string) => {
    setBudgetData({
      ...budgetData,
      items: budgetData.items.filter(item => item.id !== id)
    });
  };
  
  const handleTypeChange = (type: 'income' | 'expense') => {
    setNewItem({
      ...newItem,
      type,
      category: type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES[0] : DEFAULT_INCOME_CATEGORIES[0]
    });
  };
  
  const handleMonthlyIncomeChange = (value: string) => {
    setBudgetData({
      ...budgetData,
      monthly_income: value
    });
  };
  
  // Calculate totals
  const totalIncome = budgetData.items
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    
  const monthlyIncome = Number(budgetData.monthly_income) || 0;
  const totalAvailableIncome = monthlyIncome + totalIncome;
  
  const expensesByCategory: Record<string, number> = {};
  let totalExpenses = 0;
  
  budgetData.items
    .filter(item => item.type === 'expense')
    .forEach(item => {
      const amount = Number(item.amount) || 0;
      expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + amount;
      totalExpenses += amount;
    });
    
  const remainingBudget = totalAvailableIncome - totalExpenses;
  
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
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Budget</CardTitle>
                  <CardDescription>
                    Track your monthly income and expenses to manage your finances effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-income">Monthly Take-Home Pay</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="monthly-income"
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={budgetData.monthly_income}
                          onChange={(e) => handleMonthlyIncomeChange(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Pre-filled from your tax calculations</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Available Income</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(totalAvailableIncome)}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</p>
                      <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Remaining</p>
                      <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {formatCurrency(remainingBudget)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button 
                        variant={newItem.type === 'expense' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleTypeChange('expense')}
                      >
                        Add Expense
                      </Button>
                      <Button 
                        variant={newItem.type === 'income' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleTypeChange('income')}
                      >
                        Add Additional Income
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <Label htmlFor="item-category">Category</Label>
                        <select 
                          id="item-category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          value={newItem.category}
                          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        >
                          {newItem.type === 'expense' 
                            ? DEFAULT_EXPENSE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))
                            : DEFAULT_INCOME_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))
                          }
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="item-name">Description</Label>
                        <Input
                          id="item-name"
                          placeholder={newItem.type === 'expense' ? "Rent, Groceries, etc." : "Side job, etc."}
                          value={newItem.name}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="item-amount">Amount</Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="item-amount"
                            type="number"
                            placeholder="0"
                            className="pl-8"
                            value={newItem.amount}
                            onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddItem} 
                      className="mt-4"
                      disabled={!newItem.name || !newItem.amount}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add {newItem.type === 'expense' ? 'Expense' : 'Income'}
                    </Button>
                  </div>
                  
                  {budgetData.items.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Budget Items</h3>
                      
                      {budgetData.items.filter(item => item.type === 'expense').length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium text-destructive mb-2">Expenses</h4>
                          <div className="space-y-2">
                            {budgetData.items
                              .filter(item => item.type === 'expense')
                              .map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">({item.category})</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-destructive mr-3">{formatCurrency(Number(item.amount))}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                      
                      {budgetData.items.filter(item => item.type === 'income').length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Additional Income</h4>
                          <div className="space-y-2">
                            {budgetData.items
                              .filter(item => item.type === 'income')
                              .map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">({item.category})</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-green-600 mr-3">{formatCurrency(Number(item.amount))}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Alert className="bg-muted/30 border-muted mt-6">
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>
                      This is a simple budget tracker to help you manage your monthly finances. 
                      Your data is saved locally in your browser.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Budgeting;
