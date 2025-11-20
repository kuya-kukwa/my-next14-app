import { useEffect, useState } from 'react';

// Lightweight hook that returns true once the browser is idle.
// Uses requestIdleCallback when available with a timeout fallback.
export default function useIdle(timeout = 500) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let mounted = true;
    if ((window as any).requestIdleCallback) {
      const id = (window as any).requestIdleCallback(
        () => {
          if (mounted) setIsIdle(true);
        },
        { timeout }
      );
      return () => {
        mounted = false;
        (window as any).cancelIdleCallback?.(id);
      };
    }

    // Fallback: wait timeout ms then mark idle
    const t = window.setTimeout(() => {
      if (mounted) setIsIdle(true);
    }, timeout);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [timeout]);

  return isIdle;
}
