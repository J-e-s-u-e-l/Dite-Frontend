"use client";

import React, { useEffect, useState } from "react";
import UploadResourceForm from "@/components/feature/resource-repository/UploadResourceForm";
import ResourceList from "@/components/feature/resource-repository/ResourceList";

interface Resource {
  resourceId: string;
  resourceName: string;
  resourceType: "image" | "document";
  resourceUrl: string;
}

const ResourceRepositoryPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      const fakeData: Resource[] = [
        {
          resourceId: "1",
          resourceName: "Intro to React.pdf",
          resourceType: "document",
          resourceUrl: "/docs/intro.pdf",
        },
        {
          resourceId: "2",
          resourceName: "Class Diagram.png",
          resourceType: "image",
          resourceUrl: "/images/class-diagram.png",
        },
      ];
      setResources(fakeData);
      setIsAdmin(true);
    };

    fetchResources();
  }, []);

  const handleUpload = (formData: FormData) => {
    const file = formData.get("file");
    if (file instanceof File) {
      const newResource: Resource = {
        resourceId: Date.now().toString(),
        resourceName: file.name,
        resourceType: file.type.includes("image") ? "image" : "document",
        resourceUrl: URL.createObjectURL(file),
      };
      setResources((prev) => [...prev, newResource]);
    }
  };

  const handleDelete = (id: string) => {
    setResources((prev) => prev.filter((res) => res.resourceId !== id));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Resource Repository</h1>
      {isAdmin && <UploadResourceForm onUpload={handleUpload} />}
      <ResourceList
        resources={resources}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ResourceRepositoryPage;
