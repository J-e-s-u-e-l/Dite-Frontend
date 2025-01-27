"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "@/components/common/Logout";
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { getUnreadNotificationsCount } from "@/services/notificationServices";

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/");
  const [showSidebar, setShowSidebar] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

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

  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      const response = await getUnreadNotificationsCount();
      setNotificationCount(response.data.unreadNotificationsCount);
    };

    fetchUnreadNotificationsCount();
  }, []);

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
        } md:translate-x-0 fixed top-0 left-0 bottom-0 w-80 bg-white flex flex-col justify-between text-black shadow-lg transition-transform duration-300 z-50 md:relative md:w-64`}
      >
        <div className="flex flex-col justify-between items-center py-6 pr-4">
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
              className={`w-full text-left py-3 px-4 rounded-md flex flex-row gap-x-2 ${
                activeNav === "/"
                  ? "text-[#00BC35] bg-[#F0F5F2]"
                  : "hover:text-[#F0F5F2] hover:bg-[#00BC35]"
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3H4C3.44772 3 3 3.44772 3 4V11C3 11.5523 3.44772 12 4 12H9C9.55228 12 10 11.5523 10 11V4C10 3.44772 9.55228 3 9 3Z"
                  stroke="#00BC35"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 3H15C14.4477 3 14 3.44772 14 4V7C14 7.55228 14.4477 8 15 8H20C20.5523 8 21 7.55228 21 7V4C21 3.44772 20.5523 3 20 3Z"
                  stroke="#00BC35"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 12H15C14.4477 12 14 12.4477 14 13V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V13C21 12.4477 20.5523 12 20 12Z"
                  stroke="#00BC35"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 16H4C3.44772 16 3 16.4477 3 17V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V17C10 16.4477 9.55228 16 9 16Z"
                  stroke="#00BC35"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Home
            </button>
            <button
              onClick={() => handleNavClick("/academy")}
              className={`w-full text-left py-3 px-4 rounded-md flex flex-row gap-x-2 ${
                activeNav === "/academy"
                  ? "text-[#00BC35] bg-[#F0F5F2]"
                  : "hover:text-[#F0F5F2] hover:bg-[#00BC35]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.42 10.922C21.5991 10.843 21.751 10.7133 21.857 10.5488C21.963 10.3843 22.0184 10.1924 22.0164 9.99673C22.0143 9.80108 21.955 9.61031 21.8456 9.44807C21.7362 9.28584 21.5817 9.15925 21.401 9.08399L12.83 5.17999C12.5695 5.06114 12.2864 4.99963 12 4.99963C11.7137 4.99963 11.4306 5.06114 11.17 5.17999L2.60004 9.07999C2.42201 9.15796 2.27056 9.28613 2.16421 9.44881C2.05786 9.61149 2.00122 9.80163 2.00122 9.99599C2.00122 10.1903 2.05786 10.3805 2.16421 10.5432C2.27056 10.7059 2.42201 10.834 2.60004 10.912L11.17 14.82C11.4306 14.9388 11.7137 15.0003 12 15.0003C12.2864 15.0003 12.5695 14.9388 12.83 14.82L21.42 10.922Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 10V16"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12.5V16C6 16.7956 6.63214 17.5587 7.75736 18.1213C8.88258 18.6839 10.4087 19 12 19C13.5913 19 15.1174 18.6839 16.2426 18.1213C17.3679 17.5587 18 16.7956 18 16V12.5"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Academy
            </button>
            <button
              onClick={() => handleNavClick("/task-manager")}
              className={`w-full text-left py-3 px-4 rounded-md flex flex-row gap-x-2 ${
                activeNav === "/task-manager"
                  ? "text-[#00BC35] bg-[#F0F5F2]"
                  : "hover:text-[#F0F5F2] hover:bg-[#00BC35]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V8C22 7.46957 21.7893 6.96086 21.4142 6.58579C21.0391 6.21071 20.5304 6 20 6H12.1C11.7655 6.00328 11.4355 5.92261 11.1403 5.76538C10.8451 5.60815 10.594 5.37938 10.41 5.1L9.6 3.9C9.41789 3.62347 9.16997 3.39648 8.8785 3.2394C8.58702 3.08231 8.26111 3.00005 7.93 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 13L11 15L15 11"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Task Manager
            </button>
            <button
              onClick={() => handleNavClick("/notifications")}
              className={`w-full text-left py-3 px-4 rounded-md flex flex-row gap-x-2 ${
                activeNav === "/notifications"
                  ? "text-[#00BC35] bg-[#F0F5F2]"
                  : "hover:text-[#F0F5F2] hover:bg-[#00BC35]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.2679 21C10.4435 21.304 10.696 21.5565 11 21.732C11.304 21.9075 11.6489 21.9999 11.9999 21.9999C12.351 21.9999 12.6959 21.9075 12.9999 21.732C13.3039 21.5565 13.5564 21.304 13.7319 21"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.262 15.326C3.13137 15.4692 3.04516 15.6472 3.01386 15.8385C2.98256 16.0298 3.00752 16.226 3.08571 16.4034C3.1639 16.5807 3.29194 16.7316 3.45426 16.8375C3.61658 16.9434 3.80618 16.9999 4 17H20C20.1938 17.0001 20.3834 16.9438 20.5459 16.8381C20.7083 16.7324 20.8365 16.5817 20.9149 16.4045C20.9933 16.2273 21.0185 16.0311 20.9874 15.8398C20.9564 15.6485 20.8704 15.4703 20.74 15.327C19.41 13.956 18 12.499 18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 12.499 4.589 13.956 3.262 15.326Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Notifications
              {/* Notification Count */}
              {notificationCount > 0 && (
                <span className="bg-[#006CE1] text-white text-xs px-2 py-1 rounded-md">
                  {notificationCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mb-4 mx-auto">
          <Logout />
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-grow bg-gray-50 transition-all duration-300`}>
        {children}
      </main>

      {/* Hamburger Button for smaller screens */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        {/* <button
          onClick={toggleSidebar}
          className="focus:outline-none p-2 rounded-full bg-black/20 text-white hover:scale-105 hover:shadow-lg transition"
        >
          <HiMenu className="h-8 w-8" />
        </button> */}
        <button
          onClick={toggleSidebar}
          className="focus:outline-none p-2 rounded-full bg-black/20 text-white hover:scale-105 hover:shadow-lg transition"
        >
          <div className="relative h-8 w-8">
            <HiMenu
              className={`absolute inset-0 h-8 w-8 transform transition-all duration-700 ease-in-out ${
                isSidebarOpen ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
            />
            <HiX
              className={`absolute inset-0 h-8 w-8 transform transition-all duration-700 ease-in-out ${
                isSidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SidebarLayout;
