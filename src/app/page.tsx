"use client";

// import { useAuth } from "../context/authContext";
// import { useRouter } from "next/navigation";
// import SidebarLayout from "@/components/layout/SidebarLayout";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      {/* Welcome Message */}
      <h1 className="text-5xl font-extrabold text-blue-700 mb-4 animate-fadeIn">
        Welcome to DITE
      </h1>
      <p className="text-lg text-gray-600">
        Your gateway to streamlined coursework management.
      </p>

      {/* Navigation Options */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-11/12 max-w-4xl">
        <Link href="/academy">
          <div className="group bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-blue-100 transition duration-300">
            <svg
              className="w-12 h-12 text-blue-600 group-hover:text-blue-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v12m-6-6h12"
              />
            </svg>
            <h3 className="text-lg font-semibold mt-4 text-blue-600 group-hover:text-blue-800">
              Academy
            </h3>
          </div>
        </Link>
        <Link href="/task-manager">
          <div className="group bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-green-100 transition duration-300">
            <svg
              className="w-12 h-12 text-green-600 group-hover:text-green-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-2-4V9a2 2 0 10-4 0v4m6-10h6m-6 4h6m-6 4h6"
              />
            </svg>
            <h3 className="text-lg font-semibold mt-4 text-green-600 group-hover:text-green-800">
              Task Manager
            </h3>
          </div>
        </Link>
        <Link href="/notifications">
          <div className="group bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-yellow-100 transition duration-300">
            <svg
              className="w-12 h-12 text-yellow-600 group-hover:text-yellow-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14h-6a2.032 2.032 0 01-1.595-.595L9 12H4v2a1 1 0 001 1h5a2 2 0 002 2h3"
              />
            </svg>
            <h3 className="text-lg font-semibold mt-4 text-yellow-600 group-hover:text-yellow-800">
              Notifications
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
