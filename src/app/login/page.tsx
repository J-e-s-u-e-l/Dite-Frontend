"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useToast } from "@/context/ToastContext";
// import Toast from "../../components/common/Toast";
import Loader from "@/components/common/Loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualLoginPage />
    </Suspense>
  );
}

function ActualLoginPage() {
  const { showToast: showToast } = useToast();
  const { hideToast: hideToast } = useToast();

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const redirectTo = searchParams.get("redirect") || "/";
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    setRedirectTo(searchParams.get("redirect") || "/");
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailNotVerified = (email: string) => {
    localStorage.setItem("userEmail", email);

    showToast(
      `Your email is not verified. Redirecting to the verification page in 3 seconds...`,
      "warning"
    );

    let countdown = 5;
    const interval = setInterval(() => {
      countdown--;
      showToast(
        `Your email is not verified. Redirecting to the verification page in ${countdown} seconds...`,
        "warning"
      );

      if (countdown <= 0) {
        clearInterval(interval);
        router.push("/emailVerification");
      }
    }, 1000);

    hideToast();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status) {
        // Call login from context
        login(data.data.token);
        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("userName", data.data.username);

        // Redirect the user
        router.push(redirectTo ?? "/");
        // router.replace(redirectTo ?? "/");
      } else if (
        data.message ===
        "Your email has not been verified. Please proceed to verify your email."
      ) {
        handleEmailNotVerified(email);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.log("Something went wrong. Please try again. ", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // <Suspense fallback={<div>Loading...</div>}></Suspense>;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {loading && <Loader />}
      <h1 className="text-4xl font-bold text-[#16a34a] mb-8">Login Page</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:shadow-xl"
      >
        {/* Email Field */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-black"
            placeholder="name@domain.com"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-black"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Links for Register and Forgot Password */}
        <div className="flex justify-between flex-wrap gap-4 mb-6">
          <Link href="/register" className="text-[#16a34a] hover:underline">
            Create account
          </Link>
          <Link href="/reset-password" className="text-red-400 hover:underline">
            Forgot password
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 px-4 text-white rounded-lg transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#16a34a] hover:bg-[#138b3f] hover:shadow-md"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
