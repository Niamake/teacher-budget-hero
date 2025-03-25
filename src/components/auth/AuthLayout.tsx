
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 py-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-400/5 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 rounded-full bg-sky-300/5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
