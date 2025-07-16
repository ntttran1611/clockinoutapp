import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [tempUser, setUser] = useState(null);
  //load User from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  //save User to localStorage whenever User changes
  useEffect(() => {
    if (tempUser) {
      localStorage.setItem("User", JSON.stringify(tempUser));
    } else {
      localStorage.removeItem("User");
    }
  }, [tempUser]);

  return (
    <UserContext.Provider value={{ tempUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
