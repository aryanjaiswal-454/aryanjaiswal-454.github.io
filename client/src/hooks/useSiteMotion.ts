import { createContext, useContext } from "react";

export const SiteMotionContext = createContext(true);

export function useSiteMotion() {
  return useContext(SiteMotionContext);
}
