import { useEffect, useState } from "react";

// This hook checks if the screen width is below mobile breakpoint
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mediaQuery.addEventListener("change", checkMobile);

    // Initial check on load
    checkMobile();

    return () => {
      mediaQuery.removeEventListener("change", checkMobile);
    };
  }, []);

  return !!isMobile;
}
