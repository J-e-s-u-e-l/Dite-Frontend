"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResendDisabled, setisResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const router = useRouter();

  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose");

  const payloadPurpose = purpose === "emailVerification" ? "1" : "2";

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const payload = {
    otpCode: otp,
    purpose: payloadPurpose,
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Verification/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status) {
        alert(data.message);
        router.push("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong. Please try again." + { error });
    }
  };

  const handleResendOtp = async () => {
    try {
      const resendOtpPayload = {
        recipientType: 1,
        recipient: localStorage.getItem("userEmail"),
        purpose: 1,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Verification/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resendOtpPayload),
        }
      );

      setisResendDisabled(true);
      setTimer(30);

      const data = await response.json();

      if (data.status) {
        alert(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong. Please try again." + { error });
    }
  };

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setisResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isResendDisabled]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Verify OTP
        </h1>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVerifyOtp}
          className="w-full px-4 py-2 mb-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Verify OTP
        </button>
        <button
          onClick={handleResendOtp}
          disabled={isResendDisabled}
          className={`w-full px-4 py-2 mb-4 font-semibold rounded-lg focus:outline-none focus:ring-2 ${
            isResendDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-blue-500 hover:bg-gray-200"
          }`}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
