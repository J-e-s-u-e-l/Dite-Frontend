import React from "react";
import Spinner from "@/components/common/Spinner";

type FormFieldProps = {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  message: string | null | undefined;
  messageType?: "error" | "success";
  isChecking?: boolean;
  additionalContent?: React.ReactNode;
};

const FormField = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  // onBlur,
  message,
  messageType,
  isChecking = false,
  additionalContent = null,
}: FormFieldProps) => {
  // const [touched, setTouched] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        <span className="text-red-600"> *</span>
      </label>
      <div className="relative">
        <input
          name={label.toLowerCase()}
          type={type}
          value={value}
          onChange={onChange}
          // onBlur={(e) => {
          //   setTouched(true);
          //   onBlur(e);
          // }}
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
