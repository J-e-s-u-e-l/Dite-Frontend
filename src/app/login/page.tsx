"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the "redirect" query parameter from the URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    setRedirectUrl(redirect || "/"); // Default to "/" if no redirect URL is found
  }, []);

  // Handling form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://localhost:7185/api/Auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("authToken", data.data.token);

        // Call login from context
        login(data.data.token);

        console.log(response);
        router.push(redirectUrl || "/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again. ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Login Page</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-lg w-full max-w-sm mt-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-2 px-4 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
