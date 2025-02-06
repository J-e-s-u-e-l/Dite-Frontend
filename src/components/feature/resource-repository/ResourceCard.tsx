import React from "react";
import { downloadResource } from "@/services/academyResourceRepoServices";

interface ResourceCardProps {
  resource: {
    resourceId: string | null;
    resourceName: string;
    resourceType: "image" | "document";
  };
  isAdmin: boolean;
  onDeleteResource: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isAdmin,
  onDeleteResource,
}) => {
  // const handleDownload = async (id) => {
  //   const response = await fetch(`/api/resource/${id}`);
  //   const blob = await response.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "file.pdf"); // Use the correct file name
  //   document.body.appendChild(link);
  //   link.click();
  // };
  const handleDownload = async (resourceId) => {
    try {
      const response = await downloadResource(resourceId);

      if (response.status) {
        const file = new File([response.data], resource.resourceName, {
          type: response.headers.get("content-type"),
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    } catch (error) {
      console.error("Failed to download resource:", error);
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
          className="text-blue-600 underline text-sm"
        >
          Download
        </a>
      </div>
      {isAdmin && (
        <button
          onClick={() => onDeleteResource(resource.resourceId)}
          className="text-red-600 hover:text-red-800 font-bold"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ResourceCard;
