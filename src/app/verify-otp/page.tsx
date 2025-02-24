"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/context/ToastContext";

const VerifyOtpPage = () => {
  // const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const router = useRouter();

  const { showToast: showToast } = useToast();

  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose");

  const payloadPurpose = purpose === "emailVerification" ? 1 : 2;

  // const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setOtp(e.target.value);
  // };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (/[0-9]/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next box if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const payload = {
    Code: otp,
    Purpose: payloadPurpose,
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Verification/verify-otp`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status) {
        // alert(data.message);
        showToast(data.message, "success");
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

      setIsResendDisabled(true);
      setTimer(30);

      const data = await response.json();

      if (data.status) {
        // alert(data.message);
        showToast(data.message, "success");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong. Please try again." + { error });
    }
  };

  // Resend timer functionality
  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isResendDisabled]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous box and clear the character
      inputRefs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6); // Get only the first 6 digits
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (/[0-9]/.test(char)) {
        newOtp[i] = char;
      }
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(5, pasteData.length - 1)].focus(); // Move focus to the last filled box
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#16a34a] mb-6 text-center">
          Verify OTP
        </h1>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition-all"
            />
          ))}
        </div>

        {/* Verify OTP Button */}
        <button
          onClick={handleVerifyOtp}
          className="w-full px-4 py-3 font-semibold text-white bg-[#16a34a] rounded-lg hover:bg-[#138b3f] 
            focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition-all text-sm sm:text-base"
        >
          Verify OTP
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={handleResendOtp}
          disabled={isResendDisabled}
          className={`w-full px-4 py-3 mt-4 font-semibold rounded-lg text-sm sm:text-base transition-all 
            ${
              isResendDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-[#16a34a] hover:bg-gray-200"
            }`}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
