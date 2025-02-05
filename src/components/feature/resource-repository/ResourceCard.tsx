import React from "react";

interface ResourceCardProps {
  resource: {
    resourceId: string;
    resourceName: string;
    resourceType: "image" | "document";
    resourceUrl: string;
  };
  isAdmin: boolean;
  onDeleteResource: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isAdmin,
  onDeleteResource,
}) => {
  return (
    <div className="border rounded-md p-4 shadow-md bg-white flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{resource.resourceName}</h3>
        <p className="text-sm text-gray-500">
          {resource.resourceType.toUpperCase()}
        </p>
        <a
          href={resource.resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View/Download
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
