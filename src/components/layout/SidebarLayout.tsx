"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/components/common/Logout";
import { IoMdNotifications } from "react-icons/io";
import { HiMenu } from "react-icons/hi";

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/");
  const [showSidebar, setShowSidebar] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();

  const pagesWithoutSidebar = [
    "/login",
    "/register",
    "/verify-otp",
    "/emailVerification",
    "/passwordReset",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pagesWithoutSidebar.includes(currentPath)) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [currentPath]);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Handle navigation button click
  const handleNavClick = (link) => {
    setActiveNav(link);
    router.push(link);
  };

  if (!showSidebar) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 left-0 bottom-0 w-64 bg-blue-600 text-white shadow-lg transition-transform duration-300 z-50 md:relative md:w-64`}
      >
        <div className="flex flex-col items-center py-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold hover:text-[#F0F5F2] transition-colors"
          >
            DITE
          </Link>

          {/* User Info */}
          <div className="mt-6 flex flex-col items-center space-y-2 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-500"></div>{" "}
              {/* Placeholder Avatar */}
              <div className="flex flex-col">
                <span>Username</span>
                <span className="text-xs text-gray-300">user@example.com</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 space-y-6">
            <button
              onClick={() => handleNavClick("/")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeNav === "/"
                  ? "bg-[#00BC35] text-[#F0F5F2]"
                  : "hover:bg-[#F0F5F2] hover:text-[#00BC35]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("/academy")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeNav === "/academy"
                  ? "bg-[#00BC35] text-[#F0F5F2]"
                  : "hover:bg-[#F0F5F2] hover:text-[#00BC35]"
              }`}
            >
              Academy
            </button>
            <button
              onClick={() => handleNavClick("/task-manager")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeNav === "/task-manager"
                  ? "bg-[#00BC35] text-[#F0F5F2]"
                  : "hover:bg-[#F0F5F2] hover:text-[#00BC35]"
              }`}
            >
              Task Manager
            </button>
            <button
              onClick={() => handleNavClick("/notifications")}
              className={`w-full text-left py-2 px-4 rounded-md ${
                activeNav === "/notifications"
                  ? "bg-[#00BC35] text-[#F0F5F2]"
                  : "hover:bg-[#F0F5F2] hover:text-[#00BC35]"
              }`}
            >
              <IoMdNotifications className="inline-block mr-2" />
              Notifications
            </button>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto mb-6">
            <Logout />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-grow bg-gray-50 transition-all duration-300`}>
        {children}
      </main>

      {/* Hamburger Button for smaller screens */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <HiMenu className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default SidebarLayout;
