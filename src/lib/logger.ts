/**
 * Centralized logging utility
 * Only logs in development mode to avoid console pollution in production
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    console.warn(...args); // Always log warnings
  },
  
  error: (...args: unknown[]) => {
    console.error(...args); // Always log errors
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
