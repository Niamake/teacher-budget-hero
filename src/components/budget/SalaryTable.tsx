
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentSalarySchedule, formatCurrency } from '../../data/salarySchedules';
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SalaryTableProps {
  teacherProfile: {
    salaryStep: string;
    differential: string;
  };
  yearsAtDOE: number;
}

const SalaryTable = ({ teacherProfile, yearsAtDOE }: SalaryTableProps) => {
  const currentSchedule = getCurrentSalarySchedule();
  const salaryData = currentSchedule.differentials;
  
  // Get all unique steps across all differentials
  const getAllSteps = () => {
    const allSteps = new Set<string>();
    Object.values(salaryData).forEach(differential => {
      Object.keys(differential).forEach(step => {
        allSteps.add(step);
      });
    });
    
    // Sort steps in logical order
    return Array.from(allSteps).sort((a, b) => {
      // Extract the base step (before any +L if present)
      const baseA = a.split('+')[0];
      const baseB = b.split('+')[0];
      
      // First compare the base steps
      if (baseA !== baseB) {
        // Sort by first character (1-8)
        if (baseA[0] !== baseB[0]) {
          return parseInt(baseA[0]) - parseInt(baseB[0]);
        }
        // Then by second character (A/B)
        return baseA[1].localeCompare(baseB[1]);
      }
      
      // If base steps are the same, sort by longevity
      if (a.includes('+L') && b.includes('+L')) {
        const longevityA = parseInt(a.split('+L')[1]);
        const longevityB = parseInt(b.split('+L')[1]);
        return longevityA - longevityB;
      }
      
      // Base steps first, then longevity steps
      if (a.includes('+L')) return 1;
      if (b.includes('+L')) return -1;
      
      return 0;
    });
  };
  
  const steps = getAllSteps();
  
  // Determine if a row should be highlighted
  const isHighlightedRow = (step: string) => {
    // Highlight the exact step match
    if (teacherProfile.salaryStep === step) {
      return true;
    }
    
    // Highlight longevity step if applicable
    const baseStep = teacherProfile.salaryStep; 
    
    // Check if this is the applicable longevity step for the teacher
    if (yearsAtDOE >= 5 && yearsAtDOE < 10 && step === `${baseStep}+L5`) {
      return true;
    } else if (yearsAtDOE >= 10 && yearsAtDOE < 13 && baseStep === '8B' && step === '8B+L10') {
      return true;
    } else if (yearsAtDOE >= 13 && yearsAtDOE < 15 && baseStep === '8B' && step === '8B+L13') {
      return true;
    } else if (yearsAtDOE >= 15 && yearsAtDOE < 18 && baseStep === '8B' && step === '8B+L15') {
      return true;
    } else if (yearsAtDOE >= 18 && yearsAtDOE < 20 && baseStep === '8B' && step === '8B+L18') {
      return true;
    } else if (yearsAtDOE >= 20 && yearsAtDOE < 22 && baseStep === '8B' && step === '8B+L20') {
      return true;
    } else if (yearsAtDOE >= 22 && baseStep === '8B' && step === '8B+L22') {
      return true;
    }
    
    return false;
  };
  
  // Format the step name for display
  const formatStepName = (step: string) => {
    if (step.includes('+L')) {
      const [baseStep, longevity] = step.split('+');
      return (
        <div className="flex items-center">
          {baseStep}
          <span className="text-primary font-medium ml-1">{longevity}</span>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {longevity === 'L5' && 'Longevity increase for 5+ years of service at DOE'}
                {longevity === 'L10' && 'Longevity increase for 10+ years of service at DOE'}
                {longevity === 'L13' && 'Longevity increase for 13+ years of service at DOE'}
                {longevity === 'L15' && 'Longevity increase for 15+ years of service at DOE'}
                {longevity === 'L18' && 'Longevity increase for 18+ years of service at DOE'}
                {longevity === 'L20' && 'Longevity increase for 20+ years of service at DOE'}
                {longevity === 'L22' && 'Longevity increase for 22+ years of service at DOE'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
    return step;
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableCaption className="pb-4">
          UFT Salary Schedule (Effective: {currentSchedule.description})
        </TableCaption>
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
          {steps.map((step) => {
            // Skip steps that don't have data for BA_C1 (our baseline)
            if (!salaryData.BA_C1[step]) return null;
            
            return (
              <TableRow 
                key={step} 
                className={isHighlightedRow(step) ? "bg-primary/10" : ""}
              >
                <TableCell className="font-medium">{formatStepName(step)}</TableCell>
                <TableCell>{formatCurrency(salaryData.BA_C1[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.C1_PD[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.BA30_C2[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.C2_ID[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.MA_C2_PD[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.C2_ID_PD[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.C6[step] || 0)}</TableCell>
                <TableCell>{formatCurrency(salaryData.MA30_C6_PD[step] || 0)}</TableCell>
              </TableRow>
            );
          })}
          
          {/* Longevity increments table */}
          <TableRow className="bg-muted/50">
            <TableCell colSpan={9} className="font-medium text-center py-2">
              Longevity Increments
            </TableCell>
          </TableRow>
          {Object.entries(currentSchedule.longevityAmounts).map(([key, amount]) => (
            <TableRow key={key} className="text-sm">
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell colSpan={8}>
                {formatCurrency(amount)} additional for {key.replace('L', '')}+ years of DOE service
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryTable;
