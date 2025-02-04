import apiClient from "@/utils/apiClient";

// export const fetchMessages = async (academyId, pageNumber): Promise<any[]> => {
export const fetchMessages = async (academyId, pageNumber): Promise<any[]> => {
  try {
    const pageSize = 10;

    const payload = {
      params: {
        academyId,
        pageNumber,
        pageSize,
      },
    };
    const response = await apiClient.get(
      // `${process.env.NEXT_PUBLIC_API_URL}/${academyId}/messages`
      `${process.env.NEXT_PUBLIC_API_URL}/academies/messages`,
      payload
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
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (postMessageError) {
    throw new Error(
      postMessageError.response?.data?.message || "Failed to post message"
    );
  }
};

export const fetchMessageDetails = async (messageId: string): Promise<any> => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (fetchMessageDetailsError) {
    throw new Error(
      fetchMessageDetailsError.response?.data?.message ||
        "Failed to fetch message details"
    );
  }
};

export const postResponseToMessage = async (
  parentId: string,
  responseMessage: string
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${parentId}/responses`,
      responseMessage
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (fetchMessageDetailsError) {
    throw new Error(
      fetchMessageDetailsError.response?.data?.message ||
        "Failed to fetch message details"
    );
  }
};
