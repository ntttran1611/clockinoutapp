import { createContext, useState, useContext, useEffect } from "react";
import { getCookie, removeCookie, setAccountCookie } from "../auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [tempUser, setUser] = useState(null);
  //load User from localStorage on first render
  /*useEffect(() => {
    const storedUser = getCookie("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  //save User to localStorage whenever User changes
  useEffect(() => {
    if (tempUser) {
      setAccountCookie(tempUser);
    } else {
      removeCookie("user");
    }
  }, [tempUser]);*/

  return (
    <UserContext.Provider value={{ tempUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
