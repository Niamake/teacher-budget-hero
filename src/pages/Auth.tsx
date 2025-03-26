
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'signup' ? 'signup' : 'login';

  useEffect(() => {
    // Check for redirect URL in localStorage
    const redirectUrl = localStorage.getItem('redirectAfterAuth');
    
    // If user is already authenticated, redirect them
    const session = localStorage.getItem('sb-auth-token');
    if (session) {
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <AuthLayout defaultTab={defaultTab}>
      <LoginForm />
      <SignupForm />
    </AuthLayout>
  );
};

export default Auth;
