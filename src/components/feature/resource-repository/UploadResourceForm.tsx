import React, { useState } from "react";

interface UploadResourceFormProps {
  onUpload: (formData: FormData) => void;
}

const UploadResourceForm: React.FC<UploadResourceFormProps> = ({
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        setError("File size exceeds 5MB. Please choose a smaller file.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      onUpload(formData);
      setFile(null); // Clear file input after upload
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded-md">
      <input
        type="file"
        // accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="mb-2"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
          !file ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!file}
      >
        Upload Resource
      </button>
    </form>
  );
};

export default UploadResourceForm;
