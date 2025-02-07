import apiClient from "@/utils/apiClient";

export const uploadResource = async (
  file: File,
  newResource: any,
  academyId: string | string[] | undefined
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("academyId", academyId as string);
    formData.append("resourceName", newResource.resourceName);
    formData.append("resourceType", newResource.resourceType);

    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/uploadResource`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload resource"
    );
  }
};

export const deleteResource = async (resourceId: string) => {
  try {
    const response = await apiClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/${resourceId}`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete resource"
    );
  }
};

export const fetchResources = async (
  academyId: string | string[] | undefined
) => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/get-all-resources`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch repo resources"
    );
  }
};

export const downloadResource = async (
  resourceId: string | string[] | undefined
) => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/${resourceId}/download`,
      { responseType: "blob" } // Important for binary data
    );
    // const response = await fetch(`/api/${resourceId}/download`, {
    //   method: "GET",
    // });

    // if (!response.data.status) {
    //   throw new Error(response.data.message);
    // }

    // if (!response.data.status) {
    //   throw new Error(response.data.message);
    // }

    // return response.data;
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download resource file."
    );
  }
};
