import React, { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const [UserID, setUserID] = useState(localStorage.getItem("userID") || "");
  const [userPass, setuserPass] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  useEffect(() => {
    
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userID", UserID);
  }, [isLoggedIn, userRole, UserID]);

  const value = {
    UserID,
    setUserID,
    userPass,
    setuserPass,
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
  };

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};
