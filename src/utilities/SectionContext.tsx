import React, { createContext, useState, useContext, ReactNode } from "react";

type SectionContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const SectionContext = createContext<SectionContextType>({
  activeSection: "",
  setActiveSection: () => { },
});

export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSectionContext = () => useContext(SectionContext);
