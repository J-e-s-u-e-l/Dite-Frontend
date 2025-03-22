"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/common/Loader";
import { motion } from "framer-motion";

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

  // const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const redirectTo = searchParams.get("redirect") || "/";
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    setRedirectTo(searchParams.get("redirect") || "/home");
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
        // login(data.data.token);
        await fetch("/api/auth/set-cookie", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: data.data.token }),
        });

        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("userName", data.data.username);

        // Redirect the user
        router.push(redirectTo ?? "/home");
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
  // return (
  //   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
  //     {loading && <Loader />}
  //     <h1 className="text-4xl font-bold text-[#16a34a] mb-8">Login Page</h1>
  //     <form
  //       onSubmit={handleLogin}
  //       className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:shadow-xl"
  //     >
  //       {/* Email Field */}
  //       <div className="mb-6">
  //         <label
  //           className="block text-gray-700 text-sm font-medium mb-2"
  //           htmlFor="email"
  //         >
  //           Email
  //         </label>
  //         <input
  //           id="email"
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-black"
  //           placeholder="name@domain.com"
  //           required
  //         />
  //       </div>

  //       {/* Password Field */}
  //       <div className="mb-6">
  //         <label
  //           className="block text-gray-700 text-sm font-medium mb-2"
  //           htmlFor="password"
  //         >
  //           Password
  //         </label>
  //         <input
  //           id="password"
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-black"
  //           placeholder="Enter your password"
  //           required
  //         />
  //       </div>

  //       {/* Links for Register and Forgot Password */}
  //       <div className="flex justify-between flex-wrap gap-4 mb-6">
  //         <Link href="/register" className="text-[#16a34a] hover:underline">
  //           Create account
  //         </Link>
  //         <Link href="/reset-password" className="text-red-400 hover:underline">
  //           Forgot password
  //         </Link>
  //       </div>

  //       {/* Error Message */}
  //       {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

  //       {/* Login Button */}
  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className={`w-full mt-4 py-3 px-4 text-white rounded-lg transition-all duration-300 ${
  //           loading
  //             ? "bg-gray-400 cursor-not-allowed"
  //             : "bg-[#16a34a] hover:bg-[#138b3f] hover:shadow-md"
  //         }`}
  //       >
  //         {loading ? "Logging in..." : "Login"}
  //       </button>
  //     </form>
  //   </div>
  // );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#16a34a]">Dite Login</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please sign in.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="name@domain.com"
                required
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
                required
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z"
                />
              </svg>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-between text-sm">
            <Link href="/register" className="text-[#16a34a] hover:underline">
              Create an account
            </Link>
            <Link
              href="/reset-password"
              className="text-[#16a34a] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            variants={buttonHover}
            whileHover={loading ? undefined : "hover"}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16a34a] hover:bg-[#138b3f] hover:shadow-md"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader />
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
