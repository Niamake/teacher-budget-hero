
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, salaryData } from './SalaryEstimate';

interface SalaryTableProps {
  teacherProfile: {
    salaryStep: string;
    differential: string;
  };
}

const SalaryTable = ({ teacherProfile }: SalaryTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableCaption>UFT Salary Schedule (January 18, 2025)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Step</TableHead>
            <TableHead>BA C1</TableHead>
            <TableHead>C1 +PD</TableHead>
            <TableHead>BA+30/C2</TableHead>
            <TableHead>C2+ID</TableHead>
            <TableHead>MA/C2+PD</TableHead>
            <TableHead>C2+ID+PD</TableHead>
            <TableHead>C6</TableHead>
            <TableHead>MA+30/C6+PD</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(salaryData.BA_C1).map((step) => (
            <TableRow key={step} className={teacherProfile.salaryStep === step ? "bg-primary/10" : ""}>
              <TableCell className="font-medium">{step}</TableCell>
              <TableCell>{formatCurrency(salaryData.BA_C1[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.C1_PD[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.BA30_C2[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.C2_ID[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.MA_C2_PD[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.C2_ID_PD[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.C6[step])}</TableCell>
              <TableCell>{formatCurrency(salaryData.MA30_C6_PD[step])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryTable;
