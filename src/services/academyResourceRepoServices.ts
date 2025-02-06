import apiClient from "@/utils/apiClient";

export const uploadResource = async (
  file: File,
  newResource: any,
  academyId: string | string[] | undefined
) => {
  try {
    const payload = {
      academyId,
      newResource,
      file,
    };
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/uploadResource`,
      payload
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
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/${resourceId}/download`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download resource file."
    );
  }
};
