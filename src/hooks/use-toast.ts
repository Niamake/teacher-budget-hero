
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      if (variant === "destructive") {
        return sonnerToast.error(title, {
          description,
        });
      }
      
      if (variant === "success") {
        return sonnerToast.success(title, {
          description,
        });
      }
      
      if (variant === "info") {
        return sonnerToast.info(title, {
          description,
        });
      }
      
      if (variant === "warning") {
        return sonnerToast.warning(title, {
          description,
        });
      }
      
      return sonnerToast(title, {
        description,
      });
    },
  };
};

export const toast = sonnerToast;
