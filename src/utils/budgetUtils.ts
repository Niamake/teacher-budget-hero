
// Budget category recommendations based on best practices
export const BUDGET_CATEGORIES = [
  { 
    id: 'housing', 
    name: 'Housing', 
    recommendedPercentage: 30,
    description: 'Rent, mortgage, property taxes, home insurance, etc.'
  },
  { 
    id: 'utilities', 
    name: 'Utilities', 
    recommendedPercentage: 5,
    description: 'Electricity, water, gas, internet, phone, etc.'
  },
  { 
    id: 'food', 
    name: 'Food', 
    recommendedPercentage: 15,
    description: 'Groceries, dining out, delivery, etc.'
  },
  { 
    id: 'transportation', 
    name: 'Transportation', 
    recommendedPercentage: 10,
    description: 'Car payments, gas, public transit, rideshares, etc.'
  },
  { 
    id: 'healthcare', 
    name: 'Healthcare', 
    recommendedPercentage: 5,
    description: 'Insurance premiums, medications, doctor visits, etc.'
  },
  { 
    id: 'debt', 
    name: 'Debt Payments', 
    recommendedPercentage: 10,
    description: 'Student loans, credit cards, personal loans, etc.'
  },
  { 
    id: 'savings', 
    name: 'Savings', 
    recommendedPercentage: 10,
    description: 'Emergency fund, retirement, investments, etc.'
  },
  { 
    id: 'personal', 
    name: 'Personal Care', 
    recommendedPercentage: 5,
    description: 'Clothing, haircuts, gym, toiletries, etc.'
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    recommendedPercentage: 5,
    description: 'Streaming services, hobbies, activities, etc.'
  },
  { 
    id: 'education', 
    name: 'Education', 
    recommendedPercentage: 2,
    description: 'Books, courses, supplies, etc.'
  },
  { 
    id: 'other', 
    name: 'Miscellaneous', 
    recommendedPercentage: 3,
    description: 'Gifts, donations, fees, etc.'
  }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary' },
  { id: 'per_session', name: 'Per Session' },
  { id: 'side_hustle', name: 'Side Hustle' },
  { id: 'investments', name: 'Investments' },
  { id: 'gifts', name: 'Gifts' },
  { id: 'other', name: 'Other' }
];

// Convert budget data to Excel format
export const generateExcelData = (budgetData) => {
  // Header row
  const expenseRows = [['Category', 'Description', 'Amount']];
  const incomeRows = [['Category', 'Description', 'Amount']];
  
  // Add expenses
  budgetData.items
    .filter(item => item.type === 'expense')
    .forEach(item => {
      expenseRows.push([item.category, item.name, Number(item.amount)]);
    });
    
  // Add incomes
  budgetData.items
    .filter(item => item.type === 'income')
    .forEach(item => {
      incomeRows.push([item.category, item.name, Number(item.amount)]);
    });
    
  return {
    expenses: expenseRows,
    income: incomeRows,
    summary: [
      ['Summary'],
      ['Monthly Income', Number(budgetData.monthly_income)],
      ['Additional Income', budgetData.items
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0)],
      ['Total Expenses', budgetData.items
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0)],
      ['Remaining', budgetData.monthly_income - 
        budgetData.items
          .filter(item => item.type === 'expense')
          .reduce((sum, item) => sum + Number(item.amount), 0) +
        budgetData.items
          .filter(item => item.type === 'income')
          .reduce((sum, item) => sum + Number(item.amount), 0)]
    ]
  };
};

// Check if budget is within limit
export const checkBudgetLimit = (totalAmount, limit) => {
  if (!limit || limit <= 0) return { status: 'no-limit', percentage: 0 };
  
  const percentage = (totalAmount / limit) * 100;
  
  if (percentage >= 100) {
    return { status: 'exceeded', percentage };
  } else if (percentage >= 85) {
    return { status: 'approaching', percentage };
  } else {
    return { status: 'within', percentage };
  }
};

// Group budget items by category
export const groupItemsByCategory = (items) => {
  const grouped = {};
  
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    
    grouped[item.category].push(item);
  });
  
  return grouped;
};
