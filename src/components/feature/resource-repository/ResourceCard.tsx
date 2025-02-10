import React, { useState } from "react";
import { downloadResource } from "@/services/academyResourceRepoServices";
// import { deleteResource } from "@/services/academyResourceRepoServices";
// import Loader from "@/components/common/Loader";

interface ResourceCardProps {
  resource: {
    resourceId: string;
    resourceName: string;
    resourceType: "image" | "document";
  };
  isAdmin: boolean;
  // onDeleteResource: (resourceId: string) => void;
  onDeleteResource: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isAdmin,
  onDeleteResource,
}) => {
  const [deleteResourceModal, setDeleteResourceModal] = useState(false);

  const handleDownload = async (resourceId: string) => {
    try {
      const response = await downloadResource(resourceId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "downloaded-file";

      // Extract filename from Content-Disposition header if available
      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, ""); // Remove any quotes
      }

      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(fileURL); // Clean up memory
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="border rounded-md p-4 shadow-md bg-white flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{resource.resourceName}</h3>
        <p className="text-sm text-gray-500">
          {resource.resourceType.toUpperCase()}
        </p>
        <a
          // href={resource.resourceUrl}
          // target="_blank"
          // rel="noopener noreferrer"
          // className="text-blue-600 underline text-sm"
          onClick={() => handleDownload(resource.resourceId)}
          className="text-blue-600 underline text-sm cursor-pointer"
        >
          Download
        </a>
      </div>
      {isAdmin && (
        <button
          onClick={() => {
            setDeleteResourceModal(true);
          }}
          className="text-red-600 hover:text-red-800 font-bold"
        >
          Delete
        </button>
      )}

      {/* Remove User Modal */}
      {deleteResourceModal && (
        <div className="fixed inset=0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete Resource</h2>
            <p className="mb-4">
              Are you sure you want to delete {resource.resourceName}
              from the academy repository?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteResourceModal(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onDeleteResource(resource.resourceId)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
