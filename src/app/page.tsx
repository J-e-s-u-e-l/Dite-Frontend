"use client";

import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import Loader from "../components/common/Loader";

import Link from "next/link";

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();
  // const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* {loading && <Spinner />} */}
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

      <button
        onClick={handleLogout}
        className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
