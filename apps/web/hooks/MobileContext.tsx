"use client";

import { createContext, useContext, useState } from "react";

type MobileContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleMobile: () => void;
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggleMobile = () => {
    setOpen((prev) => !prev);
  };

  return (
    <MobileContext.Provider value={{ open, setOpen, toggleMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobile() {
  const context = useContext(MobileContext);

  if (!context) {
    throw new Error("useMobile must be used inside MobileProvider");
  }

  return context;
}
