import apiClient from "@/utils/apiClient";

// export const fetchMessages = async (academyId: string): Promise<any[]> => {
export const fetchMessages = async (academyId): Promise<any[]> => {
  try {
    const response = await apiClient.get(
      // `${process.env.NEXT_PUBLIC_API_URL}/${academyId}/messages`
      `${process.env.NEXT_PUBLIC_API_URL}/academies/messages`,
      academyId
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch messages"
    );
  }
};

export const postMessage = async (messageData: {
  messageTitle: string;
  messageBody: string;
  academyId: string;
  trackId?: string;
}): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/create`,
      messageData
    );
    return response.data;
  } catch (postMessageError) {
    throw new Error(
      postMessageError.response?.data?.message || "Failed to post message"
    );
  }
};
