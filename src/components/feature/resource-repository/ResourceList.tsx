import React from "react";
import ResourceCard from "@/components/feature/resource-repository/ResourceCard";

interface Resource {
  // resourceId: string | null;
  resourceId: string;
  resourceName: string;
  resourceType: "image" | "document";
}

interface ResourceListProps {
  resources: Resource[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  isAdmin,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.resourceId}
          resource={resource}
          isAdmin={isAdmin}
          onDeleteResource={onDelete}
        />
      ))}
    </div>
  );
};

export default ResourceList;
