import { createContext, useState, useContext } from "react";

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [tempStaff, setStaff] = useState(null);

  return (
    <StaffContext.Provider value={{ tempStaff, setStaff }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  return useContext(StaffContext);
}
