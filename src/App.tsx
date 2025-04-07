
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Salary from './pages/Salary';
import Budgeting from './pages/Budgeting';
import JobInfo from './pages/JobInfo';
import Retirement from './pages/Retirement';
import TaxEstimate from './pages/TaxEstimate';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import Support from './pages/Support';
import Feedback from './pages/Feedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" closeButton richColors />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/budgeting" element={<Budgeting />} />
            <Route path="/job-info" element={<JobInfo />} />
            <Route path="/retirement" element={<Retirement />} />
            <Route path="/tax-estimate" element={<TaxEstimate />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support/faq" element={<Support />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
