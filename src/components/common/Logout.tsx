import React from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-8 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
    >
      Logout
    </button>
  );
};
