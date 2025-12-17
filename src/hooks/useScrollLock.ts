import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals, dialogs, and overlays
 * 
 * @param isLocked - Whether scrolling should be locked
 * 
 * @example
 * ```tsx
 * const [modalOpen, setModalOpen] = useState(false);
 * useScrollLock(modalOpen);
 * ```
 */
export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isLocked) {
      // Store current scroll position in ref (more reliable)
      scrollPositionRef.current = window.scrollY;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Remove styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';

      // Restore scroll position from ref using instant scroll
      if (scrollPositionRef.current !== 0) {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    };
  }, [isLocked]);
}
