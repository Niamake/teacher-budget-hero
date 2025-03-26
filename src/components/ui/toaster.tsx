
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        style: { 
          borderRadius: 'var(--radius)',
          fontSize: '0.875rem' 
        },
        className: 'custom-toast',
      }}
    />
  );
}
