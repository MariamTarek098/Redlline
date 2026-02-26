import React, { createContext, useState } from 'react'

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  // 1. Initialize token
  const [token, setToken] = useState(() => localStorage.getItem("tkn"));
const [userPhoto, setUserPhoto] = useState(null);
  // 2. Initialize user from localStorage (parsed from JSON)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  }); 

  function setAuthUserToken(tkn) {
    setToken(tkn);
  }

  function clearToken() {
    setToken(null);
    setUser(null); 
    localStorage.removeItem("tkn"); 
    localStorage.removeItem("userData"); // 🔥 Clear user data on logout too!
  }

  return (
    <authContext.Provider value={{
      token,
      setAuthUserToken,
      clearToken,
      user,       
      setUser,
      userPhoto,
       setUserPhoto    
    }}>
      {children}
    </authContext.Provider>
  );
}