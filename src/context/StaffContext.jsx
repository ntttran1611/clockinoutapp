import { createContext, useState, useContext, useEffect } from "react";

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [tempStaff, setStaff] = useState(null);
  //load staff from localStorage on first render
  useEffect(() => {
    const storedStaff = localStorage.getItem("staff");
    if (storedStaff) {
      setStaff(JSON.parse(storedStaff));
    }
  }, []);
  //save staff to localStorage whenever staff changes
  useEffect(() => {
    if (tempStaff) {
      localStorage.setItem("staff", JSON.stringify(tempStaff));
    } else {
      localStorage.removeItem("staff");
    }
  }, [tempStaff]);

  return (
    <StaffContext.Provider value={{ tempStaff, setStaff }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  return useContext(StaffContext);
}
