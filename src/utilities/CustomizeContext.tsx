import React, { createContext, useState, useContext, ReactNode } from "react";

type CustomizeContextType = {
  text: { [key: string]: string };
  setText: (text: { [key: string]: string }) => void;
};

const CustomizeContext = createContext<CustomizeContextType>({
  text: {},
  setText: () => { },
});

export const CustomizeProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<{ [key: string]: string }>({});

  return (
    <CustomizeContext.Provider value={{ text, setText }}>
      {children}
    </CustomizeContext.Provider>
  );
};

export const useCustomizeContext = () => useContext(CustomizeContext);
