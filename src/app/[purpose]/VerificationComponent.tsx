"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface VerificationComponentProps {
  purpose: "emailVerification" | "passwordReset";
}

const VerificationComponent: React.FC<VerificationComponentProps> = ({
  purpose,
}) => {
  const router = useRouter();

  const { showToast: showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const headerText =
    purpose === "emailVerification"
      ? "Verify Your Email"
      : "Reset Your Password";
  const payloadPurpose = purpose === "emailVerification" ? 1 : 2;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const payload = {
      recipientType: 1,
      recipient: email,
      purpose: payloadPurpose,
    };

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Verification/send-otp`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("userEmail", email);
        // alert(data.message);
        showToast(data.message, "success");

        // Redirect to OTP verification page based on the purpose
        if (payloadPurpose === 1) {
          router.push("/verify-otp?purpose=emailVerification");
        } else {
          router.push("/verify-otp?purpose=passwordReset");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      // console.error("Something went wrong. Please try again." + { error });
      console.log("Something went wrong. Please try again." + { error });
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //     <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
  //       <h1 className="text-2xl font-bold text-center text-gray-800">
  //         {headerText}
  //       </h1>
  //       <form onSubmit={handleSubmit} className="mt-4">
  //         <div>
  //           <label
  //             htmlFor="email"
  //             className="block text-sm font-medium text-gray-700"
  //           >
  //             Email
  //           </label>
  //           <input
  //             id="email"
  //             type="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 sm:text-sm text-black"
  //             placeholder="Enter your email"
  //             required
  //           />
  //         </div>

  //         {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

  //         <button
  //           type="submit"
  //           disabled={isLoading}
  //           className={`mt-6 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
  //             isLoading ? "opacity-50 cursor-not-allowed" : ""
  //           }`}
  //         >
  //           {isLoading ? "Processing..." : headerText}
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 sm:p-8 bg-white shadow-lg rounded-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#16a34a]">
          {headerText}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] sm:text-sm transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full px-4 py-3 text-white bg-[#16a34a] rounded-lg hover:bg-[#138b3f] 
              focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition-all text-sm sm:text-base ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Processing..." : headerText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationComponent;
