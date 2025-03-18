
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import JobInfo from "./pages/JobInfo";
import Retirement from "./pages/Retirement";
import PreTax from "./pages/PreTax";
import TaxEstimate from "./pages/TaxEstimate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/job-info" element={<JobInfo />} />
          <Route path="/retirement" element={<Retirement />} />
          <Route path="/pre-tax" element={<PreTax />} />
          <Route path="/tax-estimate" element={<TaxEstimate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
