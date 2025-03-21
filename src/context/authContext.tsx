"use client";

// import { createContext, useContext, useEffect, useState } from "react";
import { createContext, useContext, useState } from "react";
// import { usePathname } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const pathname = usePathname();

  // const publicRoutes = [
  //   "/login",
  //   "/register",
  //   "/verify-otp",
  //   "/emailVerification",
  //   "/passwordReset",
  // ];

  // useEffect(() => {
  //   if (publicRoutes.includes(pathname)) {
  //     return;
  //   }

  //   const checkAuth = async () => {
  //     try {
  //       const response = await apiClient.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/auth/status`
  //       );

  //       if (response.data.status) {
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error("Auth check failed", error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  const login = () => {
    // document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24}`; // 1 day expiry time
    setIsAuthenticated(true);
  };

  // const logout = () => {
  //   document.cookie = `authToken=; path=/; max-age=0`;
  //   setIsAuthenticated(false);
  // };

  const logout = async () => {
    try {
      await fetch("/api/auth/set-cookie", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
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
