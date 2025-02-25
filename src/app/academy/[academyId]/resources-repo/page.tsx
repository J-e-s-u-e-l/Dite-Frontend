"use client";

import React, { useEffect, useState } from "react";
import UploadResourceForm from "@/components/feature/resource-repository/UploadResourceForm";
import ResourceList from "@/components/feature/resource-repository/ResourceList";
import Loader from "@/components/common/Loader";
import { useToast } from "@/context/ToastContext";
import {
  uploadResource,
  deleteResource,
  fetchResources,
} from "@/services/academyResourceRepoServices";
import { useParams } from "next/navigation";

interface Resource {
  resourceId: string;
  resourceName: string;
  resourceType: "image" | "document";
}

const ResourceRepositoryPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { showToast } = useToast();
  const { academyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const fetchResourcesFromAcademyRepo = async () => {
    try {
      setIsAdmin(true);

      const response = await fetchResources(academyId);
      if (response.status) {
        setResources(response.data.resources);
      }
    } catch (error) {
      showToast("Failed to fetch resources. Please try again.", "error");
      setPageError(
        "Unable to load resources due to a server issue. Please try again later or contact support if the problem persists."
      );
      console.error("Error fetching resources", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcesFromAcademyRepo();
  }, [academyId]);

  const handleUpload = async (formData: FormData) => {
    setLoading(true);
    const file = formData.get("file");
    if (file instanceof File) {
      const newResource: Resource = {
        resourceId: "",
        resourceName: file.name,
        resourceType: file.type.includes("image") ? "image" : "document",
      };

      try {
        const response = await uploadResource(file, newResource, academyId);
        if (response.status) {
          showToast(response.message, "success");
          setResources((prev) => [...prev, response.data.newResource]);
          // setResources((prev) => [...prev, newResource]);
        } else {
          showToast(response.message, "error");
        }
      } catch (error) {
        showToast("Failed to upload resource. Please try again.", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      setLoading(true);

      const response = await deleteResource(resourceId);

      if (response.status) {
        setResources((prev) =>
          prev.filter((res) => res.resourceId !== resourceId)
        );
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Failed to delete resource. Please try again.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    setPageError("");
    fetchResourcesFromAcademyRepo();
  };

  if (pageError) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={handleReload}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Resource Repository</h1> */}
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center py-4 px-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">
          Resource Repository
        </h2>
      </div>

      <div className="p-6">
        {isAdmin && <UploadResourceForm onUpload={handleUpload} />}
        {resources.length > 0 ? (
          <ResourceList
            resources={resources}
            isAdmin={isAdmin}
            onDelete={handleDelete}
          />
        ) : (
          <div>No resources yet!</div>
        )}
      </div>
    </div>
  );
};

export default ResourceRepositoryPage;
