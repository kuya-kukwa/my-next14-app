import toast from 'react-hot-toast';

/**
 * Toast notification utilities with themed styling
 */

const baseToastStyle = {
  borderRadius: '8px',
  fontWeight: '500',
  fontSize: '14px',
  padding: '12px 16px',
  maxWidth: '500px',
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      ...baseToastStyle,
      background: '#10b981',
      color: '#ffffff',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      ...baseToastStyle,
      background: '#ef4444',
      color: '#ffffff',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      ...baseToastStyle,
      background: '#3b82f6',
      color: '#ffffff',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-center',
    icon: '⚠️',
    style: {
      ...baseToastStyle,
      background: '#f59e0b',
      color: '#ffffff',
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export { toast };
