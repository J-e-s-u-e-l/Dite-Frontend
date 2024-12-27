"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   setIsAuthenticated(!!token);
  // }, []);

  useEffect(() => {
    // Function to get a cookie value by name

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    // Check if the cookie exists and is valid
    const token = getCookie("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = `authToken=; path=/; max-age=0`;
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
