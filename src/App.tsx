
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Salary from "./pages/Salary";
import Budgeting from "./pages/Budgeting";
import JobInfo from "./pages/JobInfo";
import Retirement from "./pages/Retirement";
import TaxEstimate from "./pages/TaxEstimate";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/budget" element={<Navigate to="/salary" replace />} />
            <Route path="/budgeting" element={<Budgeting />} />
            <Route path="/job-info" element={<JobInfo />} />
            <Route path="/retirement" element={<Retirement />} />
            <Route path="/pre-tax" element={<Navigate to="/tax-estimate" replace />} />
            <Route path="/tax-estimate" element={<TaxEstimate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
