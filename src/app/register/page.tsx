"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import FormField from "../../components/common/FormField";
import { debounce } from "../../utils/debounce";
import Link from "next/link";

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
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    email: false,
    username: false,
    password: false,
    "confirm password": false,
  });

  const [showTooltip, setShowTooltip] = useState(false);

  type ErrorsType = {
    [key: string]: string | null;
  };

  const [message, setMessages] = useState<ErrorsType | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Asynchronously check the email address availability
  const debouncedValidateEmail = useCallback(
    debounce(async (email: unknown) => {
      const emailStr = email as string;
      setMessages((prev) => ({
        ...prev,
        email: null,
      }));

      setIsCheckingEmail(true);

      const emailError = await validateUniqueEmail(emailStr);

      setMessages((prev) => ({
        ...prev,
        email: emailError || "",
      }));

      setIsCheckingEmail(false);
    }, 500),
    []
  );

  // Asynchronously check the username availability
  const debouncedValidateUsername = useCallback(
    debounce(async (username: unknown) => {
      const usernameStr = username as string;
      setMessages((prev) => ({
        ...prev,
        username: null,
      }));

      setIsCheckingUsername(true);

      const usernameError = await validateUsername(usernameStr);

      setMessages((prev) => ({
        ...prev,
        username: usernameError || "",
      }));

      setIsCheckingUsername(false);
    }, 500),
    []
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement & {
      name: keyof typeof formData;
    };

    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Show "required" message only if the field is empty and hasn't been modified
    if (!formData[name]) {
      setMessages((prev) => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Real-time validation logic
    if (name === "password") {
      const rules = validatePassword(value);
      setPasswordRules(rules);

      setMessages((prev) => ({
        ...prev,
        password: value
          ? Object.values(rules).every(Boolean)
            ? "Looks great!"
            : "Password is not strong enough"
          : touchedFields.password
          ? "Password is required"
          : "",
      }));
    }

    if (name === "email") {
      debouncedValidateEmail(value);
    }

    if (name === "username") {
      debouncedValidateUsername(value);
    }

    if (name === "confirm password") {
      setConfirmPassword(value);
      const confirmPasswordError = validateConfirmPassword(
        formData.password,
        value
      );
      setMessages((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError || "",
      }));
    }
  };

  // Validating confirm password against password
  useEffect(() => {
    if (confirmPassword) {
      const confirmPasswordError = validateConfirmPassword(
        formData.password,
        confirmPassword
      );

      setMessages((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError || "",
      }));
    } else {
      setMessages((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  }, [formData.password, confirmPassword]);

  // Validating all form fields before enabling submit button
  useEffect(() => {
    const areAllFieldsValid = () => {
      // Check email validity
      const isEmailValid =
        formData.email.trim() !== "" &&
        touchedFields.email &&
        message?.email?.includes("is available");

      // Check username validity
      const isUsernameValid =
        formData.username.trim() !== "" &&
        touchedFields.username &&
        message?.username?.includes("is available");

      // Check password validity
      const isPasswordValid =
        formData.password.trim() !== "" &&
        touchedFields.password &&
        Object.values(passwordRules).every(Boolean);

      // Check confirm password validity
      const isConfirmPasswordValid =
        confirmPassword.trim() !== "" &&
        touchedFields["confirm password"] &&
        message?.confirmPassword?.includes("Passwords match");

      return (
        isEmailValid &&
        isUsernameValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      );
    };

    const noErrorMessages = () => {
      if (!message) return false;

      return Object.values(message).every(
        (msg) =>
          !msg || // No message (empty string or null)
          msg.includes("is available") || // Success messages
          msg.includes("Passwords match") || // Valid match confirmation
          msg.includes("Looks great!") // Valid match confirmation
      );
    };

    // Update form validity
    setIsFormValid(!!(areAllFieldsValid() && noErrorMessages()));
  }, [formData, confirmPassword, touchedFields, message, passwordRules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Registration/user`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // const data = await response.json();

      // if (data.status) {
      //   showToast(data.message, "info");
      //   setTimeout(() => {
      //     router.push("/emailVerification");
      //   }, 5000);
      // }
      // if (!data.status) {
      //   showToast(data.message, "error");
      // }
      const data = await response.json();

      if (data.status) {
        localStorage.setItem("userEmail", formData.email);

        showToast(data.message, "info");
        setTimeout(() => {
          router.push("/verify-otp?purpose=emailVerification");
        }, 5000);
      }
      if (!data.status) {
        showToast(data.message, "error");
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg"
    >
      {loading && <Loader />}
      <h1 className="text-2xl font-bold text-[#16a34a] mb-6">Register</h1>

      <div>
        <FormField
          label="Email"
          type="email"
          placeholder="name@domain.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          message={touchedFields.email ? message?.email : null}
          messageType={
            // This code sets messageType to "success" for valid input, "error" for validation issues, and "non" if no conditions match, based on the touchedFields and message content for the field.
            touchedFields?.email && message?.email?.includes("is available")
              ? "success"
              : message?.email
              ? "error"
              : "non"
          }
          isChecking={isCheckingEmail}
        />
      </div>

      <div>
        <FormField
          label="Username"
          type="text"
          placeholder="your_username123"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          message={touchedFields.username ? message?.username : null}
          messageType={
            //This sets messageType to "success" for valid input, "error" for validation issues, and "non" if no conditions match, based on the touchedFields and message content for the field.
            touchedFields.username &&
            message?.username?.includes("is available")
              ? "success"
              : touchedFields.username &&
                message?.username?.includes(
                  "Username must be at least 3 characters."
                )
              ? "error"
              : touchedFields.username &&
                message?.username?.includes(
                  "Username must not exceed 20 characters."
                )
              ? "error"
              : touchedFields.username &&
                message?.username?.includes("Username is unavailable.")
              ? "error"
              : touchedFields.username &&
                message?.username?.includes(
                  "Only letters, numbers, and underscores are allowed."
                )
              ? "error"
              : touchedFields.username &&
                message?.username?.includes("Username is required")
              ? "error"
              : touchedFields.username &&
                message?.username?.includes(
                  "An error occurred while checking username availability."
                )
              ? "error"
              : "non"
          }
          isChecking={isCheckingUsername}
        />
      </div>

      <div className="relative">
        <FormField
          label="Password"
          type={"password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          isPasswordField={true}
          onBlur={handleBlur}
          message={
            formData.password
              ? touchedFields.password
                ? Object.values(passwordRules).every(Boolean)
                  ? "Looks great!"
                  : "Password is not strong enough"
                : ""
              : touchedFields.password
              ? "Password is required"
              : ""
          }
          messageType={
            // This code sets messageType to "success" for valid input, "error" for validation issues, and "non" if no conditions match, based on the touchedFields and message content for the field.
            formData.password
              ? touchedFields.password
                ? Object.values(passwordRules).every(Boolean)
                  ? "success"
                  : "error"
                : "non"
              : touchedFields.password
              ? "error"
              : "non"
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
                  passwordRules.hasSpecialChar
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {passwordRules.hasSpecialChar ? "✔" : "✘"} 1 special character
              </p>
            </div>
          }
        />
      </div>

      <div className="relative">
        <FormField
          label="Confirm Password"
          type={"password"}
          placeholder="Retype your password"
          value={confirmPassword}
          isPasswordField={true}
          onChange={handleChange}
          onBlur={handleBlur}
          message={
            touchedFields["confirm password"]
              ? confirmPassword
                ? message?.confirmPassword || confirmPassword
                  ? formData.password === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"
                  : "Confirm your password"
                : "Password is required"
              : ""
          }
          messageType={
            // This code sets messageType to "success" for valid input, "error" for validation issues, and "non" if no conditions match, based on the touchedFields and message content for the field.
            touchedFields["confirm password"]
              ? confirmPassword
                ? message?.confirmPassword || confirmPassword
                  ? formData.password === confirmPassword
                    ? "success"
                    : "error"
                  : "non"
                : "error"
              : "non"
          }
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        <p>
          Already have an account?{" "}
          <Link className="text-blue-500" href="/login">
            Login
          </Link>
        </p>
      </div>

      <div className="relative">
        <div
          onMouseEnter={() => !isFormValid && setShowTooltip(true)} // Show tooltip if disabled
          onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
        >
          <button
            type="submit"
            className={`w-full bg-[#16a34a] text-white py-2 px-4 rounded ${
              isFormValid ? "" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Register
          </button>
          {!isFormValid && showTooltip && (
            <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm p-2 rounded shadow-lg z-50">
              Please fill all fields correctly.
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default Register;
