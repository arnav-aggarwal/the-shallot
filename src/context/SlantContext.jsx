// src/context/SlantContext.jsx
import { createContext, useContext, useState } from "react";

const SlantContext = createContext();

export function SlantProvider({ children }) {
  const [slant, setSlant] = useState("Neutral");

  return (
    <SlantContext.Provider value={{ slant, setSlant }}>
      {children}
    </SlantContext.Provider>
  );
}

export function useSlant() {
  return useContext(SlantContext);
}
