
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/utils/taxCalculations';
import { FederalTaxBracket, StateTaxBracket, CityTaxBracket } from '@/types/tax';

interface FederalTaxBracketTableProps {
  brackets: FederalTaxBracket[];
}

export const FederalTaxBracketTable: React.FC<FederalTaxBracketTableProps> = ({ brackets }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tax Rate</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brackets.map((bracket, index) => (
          <TableRow key={index}>
            <TableCell>{(bracket.rate * 100).toFixed(0)}%</TableCell>
            <TableCell>{formatCurrency(bracket.min)}</TableCell>
            <TableCell>
              {bracket.max === Number.MAX_SAFE_INTEGER 
                ? "and up" 
                : formatCurrency(bracket.max)
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface StateTaxBracketTableProps {
  brackets: StateTaxBracket[];
}

export const StateTaxBracketTable: React.FC<StateTaxBracketTableProps> = ({ brackets }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tax Rate</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Tax Calculation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brackets.map((bracket, index) => (
          <TableRow key={index}>
            <TableCell>{(bracket.rate * 100).toFixed(2)}%</TableCell>
            <TableCell>{formatCurrency(bracket.min)}</TableCell>
            <TableCell>
              {bracket.max === Number.MAX_SAFE_INTEGER 
                ? "and up" 
                : formatCurrency(bracket.max)
              }
            </TableCell>
            <TableCell className="text-xs">
              {formatCurrency(bracket.base)} + {(bracket.rate * 100).toFixed(2)}% over {formatCurrency(bracket.over)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface CityTaxBracketTableProps {
  brackets: CityTaxBracket[];
}

export const CityTaxBracketTable: React.FC<CityTaxBracketTableProps> = ({ brackets }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tax Rate</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Tax Calculation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brackets.map((bracket, index) => (
          <TableRow key={index}>
            <TableCell>{(bracket.rate * 100).toFixed(3)}%</TableCell>
            <TableCell>{formatCurrency(bracket.min)}</TableCell>
            <TableCell>
              {bracket.max === Number.MAX_SAFE_INTEGER 
                ? "and up" 
                : formatCurrency(bracket.max)
              }
            </TableCell>
            <TableCell className="text-xs">
              {formatCurrency(bracket.base)} + {(bracket.rate * 100).toFixed(3)}% over {formatCurrency(bracket.over)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
