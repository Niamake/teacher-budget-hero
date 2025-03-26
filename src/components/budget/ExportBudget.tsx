
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateExcelData } from "@/utils/budgetUtils";
import * as XLSX from 'xlsx';

interface ExportBudgetProps {
  budgetData: any;
}

const ExportBudget = ({ budgetData }: ExportBudgetProps) => {
  const handleExport = () => {
    const { expenses, income, summary } = generateExcelData(budgetData);
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheets for each section
    const expensesWS = XLSX.utils.aoa_to_sheet(expenses);
    const incomeWS = XLSX.utils.aoa_to_sheet(income);
    const summaryWS = XLSX.utils.aoa_to_sheet(summary);
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");
    XLSX.utils.book_append_sheet(wb, expensesWS, "Expenses");
    XLSX.utils.book_append_sheet(wb, incomeWS, "Income");
    
    // Generate filename with date
    const date = new Date();
    const filename = `Teacher_Budget_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}.xlsx`;
    
    // Save the file
    XLSX.writeFile(wb, filename);
  };
  
  return (
    <Button 
      variant="outline" 
      className="ml-auto flex items-center" 
      onClick={handleExport}
    >
      <Download className="mr-2 h-4 w-4" />
      Export to Excel
    </Button>
  );
};

export default ExportBudget;
