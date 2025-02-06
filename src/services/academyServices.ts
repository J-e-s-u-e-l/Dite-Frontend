import apiClient from "@/utils/apiClient";

export const fetchTracks = async (academyId: string) => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/tracks`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    // return response.data;
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tracks");
  }
};
