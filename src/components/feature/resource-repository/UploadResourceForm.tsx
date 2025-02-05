import React, { useState } from "react";

interface UploadResourceFormProps {
  onUpload: (formData: FormData) => void;
}

const UploadResourceForm: React.FC<UploadResourceFormProps> = ({
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        disabled={!file}
      >
        Upload Resource
      </button>
    </form>
  );
};

export default UploadResourceForm;
