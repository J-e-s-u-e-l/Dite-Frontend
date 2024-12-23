"use client";

import Link from "next/link";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Optionally display a loader while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to CWSS</h1>
      <nav className="mt-4">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link href="/academy" className="text-blue-500 hover:underline">
              Academy
            </Link>
          </li>
          <li>
            <Link
              href="/task-manager"
              className="text-blue-500 hover:underline"
            >
              Task Manager
            </Link>
          </li>
          <li>
            <Link
              href="/notifications"
              className="text-blue-500 hover:underline"
            >
              Notifications
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
