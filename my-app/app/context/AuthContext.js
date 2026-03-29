"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("verifai_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (role = "user") => {
    const newUser = { 
      role, 
      id: Math.random().toString(36).substr(2, 9),
      name: role === "reporter" ? "Jane Doe (BBC Reporter)" : "Alex (Citizen)"
    };
    setUser(newUser);
    localStorage.setItem("verifai_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("verifai_user");
  };

  const isLoggedIn = !!user;
  const isReporter = user?.role === "reporter";

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isReporter, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
