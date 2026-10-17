import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

type ScrollToTopProps = {
  children: ReactNode;
};

function ScrollToTop({ children }: ScrollToTopProps) {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return <>{children}</>;
}

export { ScrollToTop };
