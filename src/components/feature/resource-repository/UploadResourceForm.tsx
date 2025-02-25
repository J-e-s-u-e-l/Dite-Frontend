import React, { useState } from "react";

interface UploadResourceFormProps {
  onUpload: (formData: FormData) => void;
}

const UploadResourceForm: React.FC<UploadResourceFormProps> = ({
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
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
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 bg-white rounded-lg shadow-md"
    >
      <label className="block text-gray-700 font-medium mb-2">
        Upload File
      </label>

      <input
        type="file"
        title="Choose a file to upload"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer 
                   file:bg-green-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md 
                   hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md transition 
                   hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={!file}
      >
        Upload Resource
      </button>
    </form>
  );
};

export default UploadResourceForm;
