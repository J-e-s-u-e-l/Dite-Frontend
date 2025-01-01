import React from "react";
import Spinner from "@/components/common/Spinner";
import { useState } from "react";

type FormFieldProps = {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  // onChange: (e) => void;
  // onFocus?: () => void;
  // onFocus?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  message: string | null | undefined;
  messageType?: "error" | "success" | "non";
  isChecking?: boolean;
  additionalContent?: React.ReactNode;
  isPasswordField?: boolean;
};

const FormField = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  onBlur,
  message,
  messageType,
  isChecking = false,
  additionalContent = null,
  isPasswordField = false,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [touched, setTouched] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        <span className="text-red-600"> *</span>
      </label>
      <div className="relative">
        <input
          name={label.toLowerCase()}
          type={isPasswordField && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full p-2 border ${
            messageType === "error"
              ? "border-red-500"
              : messageType === "success"
              ? "border-green-500"
              : "border-gray-300"
          } rounded`}
          // className={`w-full p-2 border ${
          //   message ? "border-red-500" : "border-gray-300"
          // } rounded`}
        />
        {label === "Password" || label === "Confirm Password" ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}
        {isChecking && <Spinner className="absolute right-2 top-2" size="sm" />}
      </div>
      {message && (
        <p
          className={`text-sm ${
            messageType === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      {/* {
        <p className={`text-sm ${message ? "text-red-500" : "text-green-500"}`}>
          {message || (value ? "Looks good!" : "")}
        </p>
      } */}
      {additionalContent && <div>{additionalContent}</div>}
    </div>
  );
};
export default FormField;
