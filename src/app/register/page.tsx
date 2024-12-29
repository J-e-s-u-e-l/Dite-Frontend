"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import FormField from "../../components/common/FormField";
import { debounce } from "../../utils/debounce";

import {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateUniqueEmail,
} from "../../utils/validation";
import Loader from "@/components/common/Loader";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast: showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  type ErrorsType = {
    [key: string]: string | null;
  };

  const [message, setMessages] = useState<ErrorsType | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debouncedValidateEmail = useCallback(
    debounce(async (email: string) => {
      setMessages((prev) => ({
        ...prev,
        email: null,
      }));

      setIsCheckingEmail(true);

      const emailError = await validateUniqueEmail(email);

      setMessages((prev) => ({
        ...prev,
        email: emailError || "",
      }));

      setIsCheckingEmail(false);
    }, 500),
    []
  );

  const debouncedValidateUsername = useCallback(
    debounce(async (username: string) => {
      setMessages((prev) => ({
        ...prev,
        username: null,
      }));

      setIsCheckingUsername(true);

      const usernameError = await validateUsername(username);

      setMessages((prev) => ({
        ...prev,
        username: usernameError || "",
      }));

      setIsCheckingUsername(false);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const rules = validatePassword(value);
      setPasswordRules(rules);
    }

    if (name === "email") {
      debouncedValidateEmail(value);
    }

    if (name === "username") {
      debouncedValidateUsername(value);
    }

    // if (name === "confirmPassword") {
    //   const confirmPasswordError = validateConfirmPassword(
    //     formData.password,
    //     value
    //   );
    //   setMessages((prev) => ({
    //     ...prev,
    //     confirmPassword: confirmPasswordError,
    //   }));
    // }
  };

  useEffect(() => {
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    setMessages((prev) => ({
      ...prev,
      confirmPassword: confirmPasswordError,
    }));
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    setIsFormValid(
      Object.values(message ?? {}).every((error) => error === "") &&
        Object.values(formData).every((value) => value.trim() !== "")
    );
  }, [message, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Registration/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status) {
        showToast("You have successfully created an account.", "info");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt10 p-6">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <FormField
        label="Email"
        type="email"
        placeholder="example@example.com"
        value={formData.email}
        onChange={handleChange}
        // onBlur={validateForm}
        message={message?.email}
        messageType={
          message?.email?.includes("available") ? "success" : "error"
        }
        isChecking={isCheckingEmail}
      />

      <FormField
        label="Username"
        type="text"
        placeholder="your_username"
        value={formData.username}
        onChange={handleChange}
        // onBlur={validateForm}
        message={message?.username}
        messageType={
          message?.username?.includes("available") ? "success" : "error"
        }
        isChecking={isCheckingUsername}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        // onBlur={validateForm}
        // message={message?.password}
        message={
          Object.values(passwordRules).every(Boolean)
            ? "Looks great!"
            : "Not strong enough"
        }
        messageType={
          Object.values(passwordRules).every(Boolean) ? "success" : "error"
        }
        additionalContent={
          <div className="mt-2">
            <p
              className={
                passwordRules.minLength ? "text-green-500" : "text-red-500"
              }
            >
              {passwordRules.minLength
                ? "✔ characters minimum"
                : `✘ Minimum of 8 characters (${
                    8 - formData.password.length
                  } left)`}
            </p>
            <p
              className={
                passwordRules.hasUpperCase ? "text-green-500" : "text-red-500"
              }
            >
              {passwordRules.hasUpperCase ? "✔" : "✘"} 1 uppercase letter
            </p>
            <p
              className={
                passwordRules.hasLowerCase ? "text-green-500" : "text-red-500"
              }
            >
              {passwordRules.hasLowerCase ? "✔" : "✘"} 1 lowercase letter
            </p>
            <p
              className={
                passwordRules.hasNumber ? "text-green-500" : "text-red-500"
              }
            >
              {passwordRules.hasNumber ? "✔" : "✘"} 1 number
            </p>
            <p
              className={
                passwordRules.hasSpecialChar ? "text-green-500" : "text-red-500"
              }
            >
              {passwordRules.hasSpecialChar ? "✔" : "✘"} 1 special character
            </p>
          </div>
        }
      />

      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Retype your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        // onBlur={validateForm}
        message={message?.confirmPassword}
        messageType={
          message?.confirmPassword?.includes("Passwords do not match")
            ? "error"
            : "success"
        }
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
        disabled={!isFormValid}
      >
        Register
      </button>
    </form>
  );
};

export default Register;
